import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder  } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import {RestaurentData} from './restaurent.model';

@Component({
  selector: 'app-restaurent-dash',
  templateUrl: './restaurent-dash.component.html',
  styleUrls: ['./restaurent-dash.component.css']
})

export class RestaurentDashComponent implements OnInit {

  formValue!:FormGroup
  restaurentModelObj : RestaurentData = new RestaurentData;
  allRestaurentData: any;
  filteredRestaurentData: any;
  searchTerm: string = '';
  showAdd!:boolean;
  showBtn!:boolean;

  constructor(private formbuilder: FormBuilder, private api:ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      name: [''],
      email: [''],
      mobile: [''],
      address: [''],
      services: [''],
    })
    this.getAllData();
  }
  clickAddResto(){
    this.formValue.reset();
    this.showAdd = true;
    this.showBtn = false;
  }
 
  addRestaurent(){
    this.restaurentModelObj.name = this.formValue.value.name;
    this.restaurentModelObj.email = this.formValue.value.email;
    this.restaurentModelObj.mobile = this.formValue.value.mobile;
    this.restaurentModelObj.address = this.formValue.value.address;
    this.restaurentModelObj.services = this.formValue.value.services;

    this.api.postRestaurent(this.restaurentModelObj).subscribe(res => {
      console.log(res);
      alert("Restaurent Added Successfully");
      this.formValue.reset();

      let ref= document.getElementById('close');
      ref?.click();

      this.getAllData();

    }, err=>{
      console.log(err);
      alert("Restaurent Added Failed!");
    })
  }

  getAllData(){
    this.api.getRestaurent().subscribe(res => {
      this.allRestaurentData = res;
      this.filteredRestaurentData = [...res]; // Initialize filtered data with all data
      this.applySort(); // Apply default sorting
    }, err=>{
      console.log(err);
    })
  }

  deleteResto(data: any){
    this.api.deleteRestaurant(data).subscribe((res: any) => {
      console.log(res);
      alert("Restaurent Deleted Successfully");
      this.getAllData();
    })
  }

  onEditResto(data: any){
    this.showAdd = false;
    this.showBtn = true;
    
    this.restaurentModelObj.id = data.id;
    this.formValue.controls['name'].setValue(data.name);
    this.formValue.controls['email'].setValue(data.email);
    this.formValue.controls['mobile'].setValue(data.mobile);
    this.formValue.controls['address'].setValue(data.address);
    this.formValue.controls['services'].setValue(data.services);

 
  }
  updateResto(){
    this.restaurentModelObj.name = this.formValue.value.name;
    this.restaurentModelObj.email = this.formValue.value.email;
    this.restaurentModelObj.mobile = this.formValue.value.mobile;
    this.restaurentModelObj.address = this.formValue.value.address;
    this.restaurentModelObj.services = this.formValue.value.services;

    this.api.updateRestaurant(this.restaurentModelObj.id,this.restaurentModelObj).subscribe((res: any) => {
      alert("Restaurent Updated Successfully");
      this.formValue.reset();

      let ref= document.getElementById('close');
      ref?.click();

      this.getAllData();

    })
    
  }

  // Search and Sort functionality
  searchText: string = '';
  sortColumn: string = 'id';
  sortReverse: boolean = false;

  search() {
    if (this.searchText) {
      this.filteredRestaurentData = this.allRestaurentData.filter((item: any) => {
        return Object.keys(item).some(key => {
          if (item[key] && typeof item[key] === 'string') {
            return item[key].toLowerCase().includes(this.searchText.toLowerCase());
          }
          return false;
        });
      });
    } else {
      this.filteredRestaurentData = [...this.allRestaurentData];
    }
    // Apply current sorting after filtering
    this.applySort();
  }

  clearSearch() {
    this.searchText = '';
    this.filteredRestaurentData = [...this.allRestaurentData];
    // Apply current sorting after clearing
    this.applySort();
  }

  sortBy(column: string) {
    // If clicking the same column, reverse the sort order
    if (this.sortColumn === column) {
      this.sortReverse = !this.sortReverse;
    } else {
      // If clicking a new column, set it as the sort column and default to ascending
      this.sortColumn = column;
      this.sortReverse = false;
    }
    
    this.applySort();
  }

  applySort() {
    this.filteredRestaurentData.sort((a: any, b: any) => {
      // Handle numeric sort for ID
      if (this.sortColumn === 'id') {
        return this.sortReverse 
          ? parseInt(b[this.sortColumn]) - parseInt(a[this.sortColumn])
          : parseInt(a[this.sortColumn]) - parseInt(b[this.sortColumn]);
      }
      
      // Handle string sort for other columns
      const valueA = a[this.sortColumn] ? a[this.sortColumn].toString().toLowerCase() : '';
      const valueB = b[this.sortColumn] ? b[this.sortColumn].toString().toLowerCase() : '';
      
      if (valueA < valueB) {
        return this.sortReverse ? 1 : -1;
      }
      if (valueA > valueB) {
        return this.sortReverse ? -1 : 1;
      }
      return 0;
    });
  }
  
  // Toggle address display expansion
  toggleAddressDisplay(restaurant: any) {
    restaurant.showFullAddress = !restaurant.showFullAddress;
  }
  
  // Scroll to top function
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  
}

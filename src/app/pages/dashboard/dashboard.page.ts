import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ModalController, IonContent, MenuController, Platform, AlertController } from '@ionic/angular';
import { AddCommonModelPage } from '../../pages/modal/add-common-model/add-common-model.page';

import { CommonUtils } from './../../services/common-utils/common-utils';
import { AuthService } from './../../services/auth/auth.service';

import { environment } from '../../../environments/environment';
import { query } from '@angular/animations';
import { PaginationService } from './../../services/pagination.service';
import { DomSanitizer } from '@angular/platform-browser';

declare var $ :any; //jquary declear

/* tslint:disable */ 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {

  @ViewChild(IonContent) content: IonContent;

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  // variable declartion section
  model: any = {};
  data
  isListLoading = false;
  page = 1;
  noDataFound = true;
  fetchItems;
  tableHeaderData;
  skilltableHeaderData;
  tableHeaderDataDropdown;
  current_url_path_name;
  tableheaderDropdown;
  tableheaderDropdownChecked;
  profileImagepath;
  private viewPageDataSubscribe: Subscription;
  private itemsHeaderSubscribe: Subscription;
  private jobHeaderSubscribe : Subscription;
  private formSubmitSearchSubscribe: Subscription;
  private getStateSubscribe: Subscription;
  private getCountrySubscribe: Subscription;
  parms_action_id;
  listing_view_url;
  viewLoadData;
  viewData;
  disableApplyButton = false;
  headerUrlapi;
  headerSkillapi;
  headerJobapi;
  listing_url;
  countryList:any={};
  stateList;
  cityList;

  // ......check uncheck start....
  itemcheckClick = false;
  checkedList = [];
  allselectModel;
  // check uncheck end

  // api parms
  api_parms: any = {};
  urlIdentifire = '';
  genderArry = [
    {
      name: "Male",
      value: "Male"
    },
    {
      name: "Female",
      value: "Female"
    },
    {
      name: "Other",
      value: "Other"
    },
  ];
  maritalStatus = [
    {
      name: "Single",
      id: 1
    },
    {
      name: "Married",
      id: 2
    },
    {
      name: "Divorced",
      value: 3
    },
    {
      name: "Separated",
      value: 4
    },
  ];
  formsubmit_api: string;
  private formDataSubscribe: Subscription;
  countryId;
  private getCitySubscribe: Subscription;
  getCity_api: string;
  stateId: any;
  private getFormfieldsSubscribe: Subscription;
  service_type;
  documentformFilds: any =[];
  profiletformFilds: any =[];
  profileformloader: boolean;
  docformloader: boolean;
  stateLoading: boolean = true;
  cityLoading: boolean = true;
  edit: boolean;
  imagepath: any;
  private sendFormfieldsSubscribe: Subscription;
  uploadLoader: boolean;
  constructor(
    private plt: Platform,
    private storage: Storage,
    private pagerService: PaginationService,
    private activatedRoute : ActivatedRoute,
    private router: Router,
    private http : HttpClient,
    private modalController : ModalController,
    private commonUtils : CommonUtils,
    private authService : AuthService,
    private sanitizer: DomSanitizer
  ) { }

  // tslint:disable-next-line: comment-format
  // pager object
  pager: any = {};
  // paged items
  pageItems: any[];

  listAlldata;
  getCountry_api;
  getState_api;
  country;

  // ------ init function call start -------
  commonFunction(){
    // get active url name
    this.current_url_path_name =  this.router.url.split('/')[1] + 'ColumnSelect';
    this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);

    this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');

    this.model = {
      profile : true
    }

    // table header data url name
    this.headerSkillapi = 'student/dashboard_skill_header';

    this.headerJobapi = 'student/dashboard_job_header';

    
    // view page url name
    this.listing_view_url = 'get-user' ;

    this.getCountry_api = 'country';
    
    this.getCountry();

    this.viewPageData(); 
    this.getCompletePercent();
    // view data call (autologin check)
    this.viewPageDataSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.viewPageData(); 
      }
    })

    this.jobHeaderSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.onHeaderSkillData(); 
      }
    })

    this.itemsHeaderSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.onHeaderData(); 
      }
    })

    // view data call (userdetails from header login only)
    this.viewPageDataSubscribe = this.commonUtils.signinCheckObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>..11111 >', res);
      if(res){
        this.viewPageData(); 
      }
    })

  }


  ngOnInit() {
    this.commonFunction();
  }

  // scroll event detect
  isFixedHeader;
  onScrollHedearFix(event) {
    // console.log('scroll onnnnnnnnn', event.detail.scrollTop);
    if (event.detail.scrollTop > 56) {
      // console.log("scrolling down, hiding footer...iffffffffffff");
      this.isFixedHeader = true;
    } else {
      // console.log("scrolling up, revealing footer...elseeeeeeeeeeeeeee");
      this.isFixedHeader = false;
    };
  }

  // ion View Will Enter call
  ionViewWillEnter() {
    this.commonFunction();
  }

  ionViewDidEnter(){
    // go to scroll top in mozila browser
    this.content.scrollToTop(0);
  }

  // --------- table header function -----------
  onHeaderData() {
      this.itemsHeaderSubscribe = this.http.get(this.headerSkillapi).subscribe(
        (res:any) => {

        // console.log('resData1', resData);
        this.tableHeaderData = res.return_data;
        console.log('tableHeaderData', this.tableHeaderData);
      },
      errRes => {
        // this.isLoading = false;
      }
      );
  }

  onHeaderSkillData() {
      this.jobHeaderSubscribe = this.http.get(this.headerJobapi).subscribe(
        (res:any) => {

        console.log('resData', res);
        this.skilltableHeaderData = res.return_data;
      },
      errRes => {
        // this.isLoading = false;
      }
      );
  }

  /*==========Goto view page button==========*/

  form_submit_text = 'Surging Employability';
  form_api = 'skill/return_index';
  onclickNext(_identifire){

    let fd = new FormData();
    // login or not check
    if(_identifire == 'skill'){
      this.formSubmitSearchSubscribe = this.http.post(this.form_api, fd).subscribe(
        (response:any) => {
          this.form_submit_text = 'Surging Employability';
          console.log("add form response >", response);

          if(response.return_status > 0){

              this.router.navigateByUrl(`skill-list?qualification_id=${this.viewData.qualification_data.qualification_id}&degree_id=${this.viewData.qualification_data.degree_id}`);
          }
        },
        errRes => {
          this.form_submit_text = 'Surging Employability';
        }
      );
    }else if(_identifire == 'job'){
      this.formSubmitSearchSubscribe = this.http.post(this.form_api, fd).subscribe(
        (response:any) => {
          this.form_submit_text = 'Surging Employability';
          console.log("add form response >", response);

          if(response.return_status > 0){

              this.router.navigateByUrl(`job-list?qualification_id=${this.viewData.qualification_data.qualification_id}&degree_id=${this.viewData.qualification_data.degree_id}`);
          }
        },
        errRes => {
          this.form_submit_text = 'Surging Employability';
        }
      );
    }
  }




  // open description
  openDescription(event, _item, _items){
    _item.isOpenDescription = !_item.isOpenDescription;

    /* _items.forEach(element => {
      element.isOpenDescription = false;
    });
    if(_item){
      _item.isOpenDescription = true;
    } */
  }


  // ================== view data fetch start =====================
    viewPageData(){
      this.viewLoadData = true;
      this.uploadLoader = true;
      this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
        (res:any) => {
          this.viewLoadData = false;
          this.uploadLoader = false;
          console.log("view data  res -------------------->", res.return_data);
          if(res.return_status > 0){
            this.viewData = res.return_data;
            console.log("this.viewData",this.viewData);
            this.profileImagepath = res.return_data.user_info.ProfilePath;
            this.profileImagefile = res.return_data.user_info.image;
            
            // this.model.email = res.return_data.user_info.email;
            this.model = {
              first_name:res.return_data.user_info.first_name,
              last_name:res.return_data.user_info.last_name,
              gender:res.return_data.user_info.gender,
              email:res.return_data.user_info.email,
              date_of_birth:res.return_data.user_info.date_of_birth,
              country:parseInt(res.return_data.user_info.country),
              state:parseInt(res.return_data.user_info.state),
              city:parseInt(res.return_data.user_info.city) ,
              phone_no:res.return_data.user_info.phone_no,
              security_ans:res.return_data.user_info.security_ans,
              marital_status:parseInt(res.return_data.user_info.marital_status),
              coun_code:res.return_data.user_info.coun_code,
              current_address:res.return_data.user_info.current_address,
              p_address:res.return_data.user_info.p_address,
              pin:res.return_data.user_info.pin,
            }
            this.countryId = parseInt(res.return_data.user_info.country);
            this.getState();
            this.stateId = parseInt(res.return_data.user_info.state);
            this.getCity();
            if(res.return_data.user_info.p_address == res.return_data.user_info.current_address)
            {
              this.model.addresssame = true;
            }
          }
          this.model.service_type = res.return_data.user_info.service_type;
          this.service_type = res.return_data.user_info.service_type
          // this.getDocumentForm();
          this.getProfilefilds('document');
          this.model.security_question = res.return_data.user_info.security_question
          this.model.security_ans = res.return_data.user_info.security_ans
        },
        errRes => {
          this.uploadLoader = false;
          this.viewLoadData = false;
        }
      );
    }
  // view data fetch end

  // ========= datepicker start =======
  datePickerObj: any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  };

  // get selected date
  myFunction(){
    console.log('get seleted date');
  }

  startdatePickerObj: any = {
    dateFormat: 'DD/MM/YYYY',
    closeOnSelect: true,
    yearInAscending: true
    //inputDate: new Date('2018-08-10'), // default new Date()
  };

  endDatePickerObj:any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  };

  certificationEndDatePickerObj:any ={
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  }

  experienceEndDatePickerObj:any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  }

  // --- start date select ---
  selectCycleDate;
  getStartDate;
  onDateChangeDate(_identifire, _item,  _itemDate){

    console.log('onDateChangeDate _identifire>', _identifire);
    console.log('onDateChangeDate _item >', _item);
    console.log('onDateChangeDate _itemDate >', _itemDate);

    if(_itemDate){
      // ----- original date format convert start -----
        let myFormatDate = _itemDate.split(" ")[0].split("/");
        let _mynewdate = myFormatDate[2] + "-" + myFormatDate[1] + "-" + myFormatDate[0];
      // original date format convert end

      console.log('_itemDate  start date select >>>', _itemDate);
      this.model.end_date = '';

      
      if(_identifire == 'certification_start_date'){
        _item.end_date = '';
        _item.duration = '';
        this.certificationEndDatePickerObj = {
          dateFormat: 'DD/MM/YYYY',
          fromDate: new Date(_mynewdate),
          closeOnSelect: true,
          yearInAscending: true
        };
      }else if(_identifire == 'experience_start_date'){
        _item.end_date = '';
        _item.duration = '';
        this.experienceEndDatePickerObj = {
          dateFormat: 'DD/MM/YYYY',
          fromDate: new Date(_mynewdate),
          closeOnSelect: true,
          yearInAscending: true
        };
      }

      // ----- no of day calculate start --------
      /* const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const firstDate = new Date(2008, 1, 12);
      const secondDate = new Date(2008, 1, 22);

      const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay)); */
      
      // no fo day calculate end

    }else{
      _item.end_date = '';
      _item.duration = '';
    }
    
  }


// datepicker  end

// ======================== form submit start ===================
clickButtonTypeCheck = '';
form_submit_text_save = 'Save';
form_submit_text_save_another = 'Save & Add Another' ;

// click button type 
clickButtonType( _buttonType ){
  this.clickButtonTypeCheck = _buttonType;
}

onSubmit(form:NgForm){
  console.log(form.value);
  
  this.formDataSubscribe = this.http.post('get-update-user-profile',form.value).subscribe(
    (res:any) => {
    // this.country =res.return_data;
    console.log('country', res);
    this.commonUtils.presentToast('success',res.return_message)
    this.profileEdit = false;
    this.viewPageData();
    this.getCompletePercent();
      window.location.reload();
  },
  errRes => {
    this.commonUtils.presentToast('success',errRes.return_message)
  }
  );
}
// form submit end

  // Get Country code start
  getCountry(){
    this.getCountrySubscribe = this.http.get(this.getCountry_api).subscribe(
      (res:any) => {
      this.countryList =res.return_data;
      console.log('country', res);
    },
    errRes => {
    }
    );
  }
  // Get country code end
  // onChangeLocation country start
  onChangeLocation(Id,type,more)
  {
    
    console.log(Id,type);
    
    this.model.state = '';
    this.model.city = '';
    if(type == 'state')
    {
      this.stateLoading = true;
      this.cityLoading = true;
      this.countryId = Id;
      this.getState();
      console.log(Id,type);
     
    }else if(type == 'city')
    {
      this.stateId = Id;
      this.cityLoading = true;
      this.getCity();
      
    }
    
  }
  // onChangeLocation country end
   // Get state  start
  getState(){
    this.getState_api = 'state/'+this.countryId;
    this.stateLoading = true;
    this.getStateSubscribe = this.http.get(this.getState_api).subscribe(
      (res:any) => {
        this.stateLoading = false;
      this.stateList = res.return_data;
      console.log('country', res);
    },
    errRes => {
      this.stateLoading = false;
    }
    );
  }
  // Get state  end
  // Get state  start
  getCity(){
    this.getCity_api = 'city/'+this.stateId;
    this.cityLoading = true;
    this.getCitySubscribe = this.http.get(this.getCity_api).subscribe(
      (res:any) => {
        this.cityLoading = false;
      this.cityList = res.return_data;
      console.log('country', res);
    },
    errRes => {
      this.cityLoading = false;
    }
    );
  }
  // Get state  end
  // addressSameorNot start
  addressSameorNot(e)
  {
    console.log(e);
    
  }
  // addressSameorNot end
  // editOrNot start
  profileEdit = false;
  // editOrNot(_identifier, _value){
  //   if(_identifier == 'profile'){
  //     if(_value == true){
  //       this.model.profile = false;
  //     }else {
  //       this.model.profile = true;
  //     }
  //   }
  // }
  // editOrNot end
  // completePercent start
  completePercent = 0
  getCompletePercent()
  {
    this.getFormfieldsSubscribe = this.http.get('get-profile-progress').subscribe(
      (res:any) => {
        this.completePercent = res.return_data;
      },
      errRes => {
        this.docformloader = false;
      }
    );
  }
  // completePercent end
  // getProfilefilds start
  getProfilefilds(type)
  {
    this.profileformloader = true; 
    this.docformloader = true;
    console.log(type);
    if(type == 'document')
    {
      this.getFormfieldsSubscribe = this.http.get('get-document-form').subscribe(
        (res:any) => {
          this.documentformFilds = res.return_data;
          console.log("this.documentformFilds",this.documentformFilds);
          this.docformloader = false;
          if(res.return_type == 'update')
          {
            this.edit = true;
          }else if(res.return_type == 'show')
          {
            this.edit = false;
            this.filtterData();
            if(res.return_path)
            {
              this.imagepath = res.return_path;
            }
            // for (let val in this.documentformFilds) {
            //   console.log("val",val);
            //    console.log("val",typeof val);
            // }
            // console.log("typeof",typeof );
            
          }
        },
        errRes => {
          this.docformloader = false;
        }
      );
    }
    // else if(type == 'profile')
    // {
    //   this.getFormfieldsSubscribe = this.http.get('get-profile-form').subscribe(
    //     (res:any) => {
    //       this.profileformloader = false; 
    //       this.profiletformFilds = res.return_data;
    //       console.log("this.profiletformFilds",this.profiletformFilds);
          
    //     },
    //     errRes => {
    //       this.profileformloader = false;
    //     }
    //   );
    // }
  }
  // getProfilefilds end
  document_img:any=[];
  chech_box_data:any=[];
  filtterData()
  {
    console.log("Custom Data",this.document_img,this.chech_box_data);
    if(this.documentformFilds.document_img.length)
    {
      this.document_img = this.documentformFilds.document_img;
    }
    if(this.documentformFilds.chech_box_data.length)
    {
      this.chech_box_data = this.documentformFilds.chech_box_data;
    }
    var  x;
    for (let val in this.document_img) {
      // if(this.document_img[val] == undefined){
      //   // form.value[val] = ' ';
      // }else{
      //   fb.append(val, form.value[val]);
      // }
      // var x = this.document_img[val].split(".").pop();
      // x.push(Object.values(this.document_img[val]));
      x = Object.values(this.document_img[val]);
      console.log("Custom Data",val,this.document_img[val],Object.values(this.document_img[val]));

    }
    console.log("Custom Data",this.document_img,this.chech_box_data);
    
  }
  imageSrc:any=[];
  images:any=[];
  fieldNames:any=[];
  readURL(event,index,fieldName){
    console.log(event);
    const file = event.target.files && event.target.files[0];
    
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
      var x = (<FileReader>event.target).result;
      this.imageSrc[index]=((<FileReader>event.target).result)

      // this.images.push({"fieldName":fieldName,"img": (<FileReader>event.target).result})
      let count=0
      for (let i = 0; i < this.images.length; i++) {
        if(this.images[i].fieldName==fieldName)
        {
          this.images[i].img=(<FileReader>event.target).result;
          count=1;
          this.fieldNames.push(fieldName)
        }
      }
      if(count==0)
      {
        this.images.push({"fieldName":fieldName,"img": (<FileReader>event.target).result})
        this.fieldNames.push(fieldName)
      }
      }
    }
    console.log(index,this.imageSrc,this.images);
    
  }
  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }
  // checkList start
  checkListData:any=[];
  checkListKey:any=[];
  checkList(e,field)
  {
    // e.target.checked
    let count = 0;
    if(e.target.checked)
    {
      for (let index = 0; index < this.checkListData.length; index++) {
        if(this.checkListData[index].value == e.target.value)
        {
          // this.checkListData[index].value = e.target.value;
          count = 1;
        }
        else
        {
          count = 0;
        }

      }
      if(count==0)
      {
        this.checkListData.push({"slug":field,"value": e.target.value})
        // this.fieldNames.push(fieldName)
      }
    }
    else
    {
      for (let index = 0; index < this.checkListData.length; index++) {
        if(this.checkListData[index].value == e.target.value)
        {
          this.checkListData.splice(index,1)
          count = 1;
        }
        else
        {
          count = 0;
        }

      }
      console.log(e.target.value,field);
      
    }
    console.log(this.checkListData,e.target.value,field);

    // this.checkListData.push(e.target.value);
    console.log(this.checkListData);
    
  }
// checkList end
  // onSubmitDocumentForm start
  onSubmitDocumentForm(form:NgForm)
  {
    console.log(form.value);
    let fb = new FormData();
    var img:any=[];
    for (let index = 0; index < this.images.length; index++) {
      var data = this.images[index].img;
     fb.append("file[]",this.DataURIToBlob(data))
    }
    console.log(img);
    
    for (let val in form.value) {
      if(form.value[val] == undefined){
        // form.value[val] = ' ';
      }else{
        fb.append(val, form.value[val]);
      }
      
    }
    fb.append('types',this.fieldNames);
    fb.append('checkList',JSON.stringify(this.checkListData));
    this.getFormfieldsSubscribe = this.http.post('get-update-document-form',fb).subscribe(
      (res:any) => {
        this.commonUtils.presentToast('success',res.return_message)
        window.location.reload();
      },
      errRes => {
        this.commonUtils.presentToast('success',errRes.error.message)
      }
    );
  }
  // onSubmitDocumentForm end
  profileImagefile;
  profileImage(event)
  {
    this.uploadLoader = true;
    let fb = new FormData();
    fb.append("image",event.target.files[0]);
    this.sendFormfieldsSubscribe = this.http.post('get-update-user-image',fb).subscribe(
      (res:any) => {
        this.commonUtils.presentToast('success',res.return_message)
        this.profileImagefile  = res.return_data;
        this.viewPageData();
        this.uploadLoader = false;
        window.location.reload();
      },
      errRes => {
        this.commonUtils.presentToast('success',errRes.return_message);
        this.uploadLoader = false;
      });
  }
  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.viewPageDataSubscribe !== undefined){
      this.viewPageDataSubscribe.unsubscribe();
    }
    if(this.itemsHeaderSubscribe !== undefined){
      this.itemsHeaderSubscribe.unsubscribe();
    }
    if(this.jobHeaderSubscribe !== undefined) {
      this.jobHeaderSubscribe.unsubscribe();
    }
    if(this.formSubmitSearchSubscribe !== undefined){
      this.formSubmitSearchSubscribe.unsubscribe();
    }
    if(this.getCountrySubscribe !== undefined){
      this.getCountrySubscribe.unsubscribe();
    }
    if(this.getStateSubscribe !== undefined){
      this.getStateSubscribe.unsubscribe();
    }
    if(this.getCitySubscribe !== undefined){
      this.getCitySubscribe.unsubscribe();
    }
    if(this.getFormfieldsSubscribe !== undefined){
      this.getFormfieldsSubscribe.unsubscribe();
    }
    if(this.formDataSubscribe !== undefined){
      this.formDataSubscribe.unsubscribe();
    }
  }
  // destroy subscription end
}


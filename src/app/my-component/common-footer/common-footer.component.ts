import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResponsiveService } from '../../services/responsive.service';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';

import { CommonUtils } from '../../services/common-utils/common-utils';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'common-footer',
  templateUrl: './common-footer.component.html',
  styleUrls: ['./common-footer.component.scss'],
})

/* tslint:disable */ 
export class CommonFooterComponent implements OnInit, OnDestroy {

  
  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  // variable
  public isMobile: Boolean;
  model: any = {};
  private formSubmitSearchSubscribe: Subscription;
  private itemsSubscribe : Subscription;
  footerPageData;
  form_api;
  private getFooterSubscribe: Subscription;


  constructor(
    private responsiveService : ResponsiveService,
    private http : HttpClient,
    private commonUtils : CommonUtils,
    private navCtrl : NavController,
  ) { }

  //--------------  getlist data fetch start -------------
  selectLoadingDepend;
  getFooter_api;
  footer;
  chatWidget = false;





  // init
  ngOnInit() {

    this.form_api = 'subscriber/footer';
    this.onResize();
    this.responsiveService.checkWidth();

    // get footer data from commoninfo api
    this.itemsSubscribe = this.commonUtils.commonDataobservable.subscribe((res:any) =>{
      console.log('footer data res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.footerPageData = res;
      }
    })

    // getfooter api
    this.getFooter_api = 'footer';
    this.getFooter();

  }

  // Open chatbox start
  openChatBox(){
    if(this.chatWidget == false){
      this.chatWidget = true;
    }else {
      this.chatWidget = false;
    }
  }
  // open chatbox end

  // send mail start
  sendMail(){
    window.open('mailto:'+this.footer.data.email, '_blank');
  }
  // send mail end

  // sendWhatsapp start
  sendWhatsapp(_msg){
    console.log('this.footer.social[5]', this.footer.social[5]);

    if(this.isMobile == true){
      window.open('https://api.whatsapp.com/send?text='+_msg+'&phone='+this.footer.social[5], '_blank');
    }else {
      window.open('https://web.whatsapp.com/send?text='+_msg+'&phone='+this.footer.social[5], '_blank');
    }
    
    this.openChatBox();
  }
  // sendWhatsapp end

  //getFooter
  getFooter(){
    this.selectLoadingDepend = true;
    this.getFooterSubscribe = this.http.get(this.getFooter_api).subscribe(
      (res:any) => {
      this.selectLoadingDepend = false;
      this.footer =res.return_data;
      console.log('footer', res);
    },
    errRes => {
      this.selectLoadingDepend = false;
    }
    );
  } 

  onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
      console.log('this.isMobile >', this.isMobile);
    });
  }

  // ======================== newsletter subscribtion submit start ===================
    form_submit_text = false;

    onSubmitSubscribetion(form:NgForm){
      console.log("add form submit >", form.value);

      this.form_submit_text = true;

      // get form value
      let fd = new FormData();
      for (let val in form.value) {
        if(form.value[val] == undefined){
          form.value[val] = '';
        }
        fd.append(val, form.value[val]);
      };

      console.log('value >', fd);

      if(!form.valid){
        return;
      }

      this.formSubmitSearchSubscribe = this.http.post(this.form_api, fd).subscribe(
        (response:any) => {
          console.log("add form response >", response);

          if(response.return_status > 0){
            // this.commonUtils.presentToast(response.return_message);
            this.commonUtils.presentToast('success', response.return_message);

            // this.notifier.notify( type, 'aa' );
              form.reset();
              this.form_submit_text = false;
          }

        },
        errRes => {
          this.form_submit_text = false;
        }
      );

    }
  // newsletter subscribtion submit end

  //  page go
  addClass: boolean = false;
  goToPage(_url, _item){
    console.log('goToPage _url >', _url);
    console.log('goToPage _item >', _item);
    // this.router.navigateByUrl(_url);

    this.navCtrl.navigateRoot(_url);
    // _item.addClass = !_item.addClass;   
    
    /* this.main_menu.forEach(element => {
      element.addClass = false;
    }); */
    
    _item.addClass = true;
  }

  // mat-accordion open start
    step = 0;

    setStep(index: number) {
      this.step = index;
    }
  // mat-accordion end

  // ----------- destroy subscription ---------
  ngOnDestroy() {
    if(this.itemsSubscribe !== undefined){
      this.itemsSubscribe.unsubscribe();
    }
    if(this.formSubmitSearchSubscribe !== undefined){
      this.formSubmitSearchSubscribe.unsubscribe();
    }
  }

}

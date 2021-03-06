import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Route } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  public signupForm: FormGroup;
  public showLoader: any;
  constructor(public navCtrl: NavController,
    public authService: AuthenticationService,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loader: LoadingController
  ) {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.MatchPassword });
  }

  /**
   * 
   * @param AC Form Data
   * Check Password and Confirm Password
   */
  MatchPassword(AC: AbstractControl) {
    const pswd = AC.get('password').value;
    const confirmPswd = AC.get('confirmPassword').value;

    if (pswd !== confirmPswd) {
      AC.get('confirmPassword').setErrors({ MatchPassword: true });
    } else {
      AC.get('confirmPassword').setErrors(null);
    }
  }

  /**
   * 
   * @param val Login Form Data
   */
  submitForm(val: any) {
    if (val.value.password !== val.value.confirmPassword) {
      this.alertCtrl.create({
        header: 'SignUp',
        message: 'Password not match',
        buttons: ['OK']
      }).then((alert: any) => {
        alert.present();
      });
      return false;
    }
    this.loader.create({
      message: 'Please wait...',
    }).then((showLoader: any) => {
      showLoader.present();
    });
    this.authService.registerUser(val.value).then((success: any) => {
      this.alertCtrl.create({
        header: 'SignUp',
        message: 'Register successfully',
        buttons: ['OK']
      }).then((alert: any) => {
        alert.present();
      });
      this.loader.dismiss();
      this.navCtrl.navigateBack('/login');
    }).catch((error: any) => {
      this.loader.dismiss();
      if (error.code === 'auth/email-already-in-use') {
        this.alertCtrl.create({
          header: 'SignUp',
          message: 'This email address is already register',
          buttons: ['OK']
        }).then((alert: any) => {
          alert.present();
        });
      }
    });
  }
}

import { NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule, NgForm, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/interfaces/user';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-login',
    imports: [
      NgStyle,
      RouterLink,
      FormsModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  returnUrl: any;
  loggedin: boolean = false;
  Urfc: string = '';
  Upassword: string = '';
  userRole$: Observable<string | undefined>;
  formLogin: FormGroup;

  public _userService = inject(UserService);

  constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder) {

    this.formLogin = this.fb.group({
      Urfc: [null, Validators.required],
      Upassword: [null, Validators.required],
    },{
        validators: []
    });

  }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

 
  onLoggedin(form: NgForm) {
    // console.log('envio login')
    const user: User = {
      rfc: form.value.Urfc,
      password: form.value.Upassword
    };

    this._userService.login(user).subscribe({
      next: (response: any) => {
        const userData = response.user;
        const bandera = response.bandera;
        localStorage.setItem('isLoggedin', 'true'); 
        this._userService.setCurrentUser(userData);
        console.log(bandera)
        if (bandera) {
          this.router.navigate(['/citas']);
        } else {
          //console.log('admin')
          this.router.navigate(['/reportes']);
        }
      },
      error: (e: HttpErrorResponse) => {
        if (e.status === 416) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Ya no hay lugares disponibles.",
            showConfirmButton: false,
            timer: 3000
          });
        } else if (e.status === 400) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Usuario no existe.",
            showConfirmButton: false,
            timer: 3000
          });
        }else if (e.status === 402) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Contraseña incorrecta.",
            showConfirmButton: false,
            timer: 3000
          });
        } else {
          console.error('Error desconocido:', e);
        }
      },
    });

    // console.log(user);
    
  }

}

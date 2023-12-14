import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRoles: ['can_read_users', 'can_create_users', 'can_update_users', 'can_read_users', 'admin']
    }
  },
  {
    path: 'create',
    component: CreateComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRoles: ['can_create_users',]
    }
  },
  {
    path: 'edit',
    canActivate: [AuthGuard],
    component: EditComponent,
    data: {
      expectedRoles: ['can_update_users']
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

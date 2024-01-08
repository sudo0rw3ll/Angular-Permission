import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { VacuumsComponent } from './vacuums/vacuums.component';
import { TimestampPipe } from './timestamp.pipe';
import { AddVacuumComponent } from './add-vacuum/add-vacuum.component';
import { ErrorsComponent } from './errors/errors.component';
import { ActionPipe } from './action.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    CreateComponent,
    EditComponent,
    VacuumsComponent,
    TimestampPipe,
    AddVacuumComponent,
    ErrorsComponent,
    ActionPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

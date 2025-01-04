import { HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';

function loggingInterceptors(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  // console.log(request)
  // console.log(request.body)
  // console.log(request.headers)
  return next(request);
}


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([loggingInterceptors])), 
    provideAnimations()]
}).catch((err) => console.error(err));

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth/auth.guard';

/* tslint:disable */ 
const routes: Routes = [
  { 
    path: '', 
    loadChildren: './pages/home/home.module#HomePageModule',
    pathMatch: 'full' 
  },
  { 
    path: 'index', 
    loadChildren: './pages/home/home.module#HomePageModule'
  },
  { 
    path: 'dashboard', 
    loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'profile/:id', 
    loadChildren: './pages/profile/profile.module#ProfilePageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'contact', 
    loadChildren: './pages/contact-us/contact-us.module#ContactUsPageModule' 
  },
  { 
    path: 'about-us', 
    loadChildren: './pages/about-us/about-us.module#AboutUsPageModule' 
  },
  { 
    path: 'cms/:action', 
    loadChildren: './pages/cms/cms.module#CmsPageModule' 
  },
  { 
    path: 'service/:action',
    loadChildren: './pages/service/service.module#ServicePageModule' 
  },
  { 
    path: 'news-details/:id', 
    loadChildren: './pages/news-details/news-details.module#NewsDetailsPageModule',

  },
  { 
    path: 'event/:action', 
    loadChildren: './pages/event/event.module#EventPageModule', 
  },
  {
    path: '**',   // redirects all other routes to the main page
    loadChildren: './pages/home/home.module#HomePageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled', preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
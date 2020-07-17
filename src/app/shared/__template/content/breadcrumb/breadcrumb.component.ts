import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { Breadcrumb } from './breadcrumb.model';
import { filter, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  breadcrumbs: Breadcrumb[];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.breadcrumbs = this.buildBreadCrumb(this.route.root);
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd),
      distinctUntilChanged(),
      ).subscribe(() => {
        this.breadcrumbs = this.buildBreadCrumb(this.route.root);
    })
  }

  /**
  * Recursively build breadcrumb according to activated route.
  * @param route
  * @param url
  * @param breadcrumbs
  */
  private buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []):
    Breadcrumb[] {

    //If no routeConfig is avalailable we are on the root path
    let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.breadcrumb : '';
    let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';

    // If the route is dynamic route such as ':id', remove it
    const lastRoutePart = path.split('/').pop();
    const isDynamicRoute = lastRoutePart.startsWith(':');
    if (isDynamicRoute && !route.snapshot) {
      const paramName = lastRoutePart.split(':')[1];
      path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
      label = route.snapshot.params[paramName];
    }

    //In the routeConfig the complete path is not available,
    //so we rebuild it each time
    const nextUrl = path ? `${url}/${path}` : url;

    const breadcrumb: Breadcrumb = {
      label: label,
      route: nextUrl,
    };
    // Only adding route with non-empty label
    const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
    if (route.firstChild) {
      //If we are not on our current path yet,
      //there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  /************* TABLE CONFIG **************/
  public readonly rows = 10;
  public readonly showCurrentPageReport = true;
  public readonly paginator = true;
  public readonly lazy = true;
  public readonly resizableColumns = true;
  public readonly rowHover = true;
  public readonly currentPageReportTemplate = 'global.current_page_template';
  public readonly rowsPerPageOptions = [10, 20, 30];
  public readonly emptymessage = 'global.empty_table_message';
  // public readonly ariaLabel = "global.tooltip_order";
  // public readonly ariaLabelDesc = "global.tooltip_order_desc";
  // public readonly ariaLabelAsc = "global.tooltip_order_asc";
  public readonly responsive = true;
  public readonly scrollable = true;


  /************* CONFIRM DIALOG **************/
  public readonly confirmHeader = 'global.confirm_remove';
  public readonly confirmHeaderCancel = 'global.confirm_cancel';
  public readonly confirmIcon = 'pi pi-exclamation-triangle';
  public readonly yesLabel = 'global.yes';
  public readonly noLabel = 'global.no';


  /************* IMG DIALOG **************/
  public readonly dismissableMask = "true";
  public readonly draggable = "false";
  public readonly resizable = "false";
  public readonly modal = "true";
  public readonly blockScroll = "true";
  public readonly appendTo = "body";

   /************* REPORT **************/
   public readonly orientation = "landscape";

   /************* NOTIFICATION **************/
   public readonly duration = 7000;

   /************* ERRORS **************/
   public readonly retry = 1;
}

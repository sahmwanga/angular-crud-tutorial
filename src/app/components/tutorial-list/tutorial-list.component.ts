import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-tutorial-list',
  templateUrl: './tutorial-list.component.html',
  styleUrls: ['./tutorial-list.component.css']
})
export class TutorialListComponent implements OnInit {

  tutorials?: any = [];
  currentTutorial: Tutorial = {};
  currentIndex = -1;
  title = "";

  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3, 6, 9]

  constructor(private tutorialService: TutorialService) { }

  ngOnInit(): void {
    this.retrieveTutorials();
  }

  getRequestParams(searchTitle: string, page: number, pageSize: number): any {
    let params: any = {}
    if (searchTitle) {
      params[`title`] = searchTitle;
    }

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }

  retrieveTutorials(): void {
    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.tutorialService.getAll(params).subscribe({
      next: (response) => {
        const { tutorials, totalItems } = response;
        this.tutorials = tutorials;
        this.count = totalItems;
      },
      error: (e) => console.log(e)
    })
  }

  refreshList(): void {
    this.retrieveTutorials();
    this.currentTutorial = {};
    this.currentIndex = -1;
  }

  setActiveTutorial(tutorial: Tutorial, index: number): void {
    this.currentTutorial = tutorial;
    this.currentIndex = index;
  }

  removeAllTutorials(): void {
    this.tutorialService.deleteAll()
      .subscribe({
        next: (res) => {
          console.log(res);
          this.refreshList();
        },
        error: (e) => console.error(e)
      });
  }

  searchTitle(): void {
    // this.currentTutorial = {};
    // this.currentIndex = -1;

    this.page = 1;
    this.retrieveTutorials()

    // this.tutorialService.findByTitle(this.title)
    //   .subscribe({
    //     next: (data) => {
    //       this.tutorials = data;
    //       console.log(data);
    //     },
    //     error: (e) => console.error(e)
    //   });
  }


  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveTutorials()
  }
  handlePageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveTutorials();
  }


}

import { Component, inject, output } from '@angular/core';
import { ImdbGenre, ImdbSearchParams, ImdbSortField, ImdbSortOrder } from '../../interfaces/imdbSearchParams';

import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators, FormsModule, ValidatorFn } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Slider } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-search-form',
  imports: [
    MultiSelectModule,
    ReactiveFormsModule,
    FormsModule,
    IconField,
    IconFieldModule,
    InputIcon,
    InputTextModule,
    Slider,
    CheckboxModule,
    ButtonModule,
    DatePicker,
  ],
  templateUrl: './search-form.html',
  styles: ``
})
export class SearchForm {
  search = output<ImdbSearchParams>();

  formBuilder = inject(FormBuilder);
  searchForm!: FormGroup;

  rangeValues: number[] = [0, 10];

  minYear = new Date(1960, 0, 1);
  maxYear = new Date();

  genres: ImdbGenre[] = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror',
    'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Sport',
    'Thriller', 'War', 'Western'
  ];

  sortFields: ImdbSortField[] = ['id', 'primaryTitle', 'averageRating', 'numVotes', 'startYear'];
  sortOrders: ImdbSortOrder[] = ['ASC', 'DESC'];

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      primaryTitle: [''],
      genre: [''],
      genres: [[]],
      averageRatingFrom: [''],
      averageRatingTo: [''],
      startYearFrom: [null],
      startYearTo: [null],
      sortField: ['id'],
      sortOrder: ['ASC'],
      type: ['movie'],
      rows: [10]
    }, { validators: this.yearRangeValidator });
  }

  onRatingChange(event: any) {

    this.rangeValues = event.value;
  }

  onSubmit(): void {
    const value = this.searchForm.value;
    const params: ImdbSearchParams = {
      ...value,
      averageRatingFrom: this.rangeValues[0],
      averageRatingTo: this.rangeValues[1],
      genre: value.genre || undefined,
      primaryTitle: value.primaryTitle?.trim() || undefined,
      startYearFrom: value.startYearFrom ? new Date(value.startYearFrom).getFullYear() : undefined,
      startYearTo: value.startYearTo ? new Date(value.startYearTo).getFullYear() : undefined
    };
    this.search.emit(params);
  }

  yearRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const from = control.get('startYearFrom')?.value;
    const to = control.get('startYearTo')?.value;

    if (from && to && new Date(from).getFullYear() > new Date(to).getFullYear()) {
      return { yearRangeInvalid: true };
    }
    return null;
  };
}

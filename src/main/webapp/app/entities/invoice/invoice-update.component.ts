import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IInvoice, Invoice } from 'app/shared/model/invoice.model';
import { InvoiceService } from './invoice.service';
import { IProductOrder } from 'app/shared/model/product-order.model';
import { ProductOrderService } from 'app/entities/product-order/product-order.service';

@Component({
  selector: 'jhi-invoice-update',
  templateUrl: './invoice-update.component.html',
})
export class InvoiceUpdateComponent implements OnInit {
  isSaving = false;
  productorders: IProductOrder[] = [];

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    details: [],
    status: [null, [Validators.required]],
    paymentMethod: [null, [Validators.required]],
    paymentDate: [null, [Validators.required]],
    paymentAmount: [null, [Validators.required]],
    order: [],
  });

  constructor(
    protected invoiceService: InvoiceService,
    protected productOrderService: ProductOrderService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ invoice }) => {
      if (!invoice.id) {
        const today = moment().startOf('day');
        invoice.date = today;
        invoice.paymentDate = today;
      }

      this.updateForm(invoice);

      this.productOrderService.query().subscribe((res: HttpResponse<IProductOrder[]>) => (this.productorders = res.body || []));
    });
  }

  updateForm(invoice: IInvoice): void {
    this.editForm.patchValue({
      id: invoice.id,
      date: invoice.date ? invoice.date.format(DATE_TIME_FORMAT) : null,
      details: invoice.details,
      status: invoice.status,
      paymentMethod: invoice.paymentMethod,
      paymentDate: invoice.paymentDate ? invoice.paymentDate.format(DATE_TIME_FORMAT) : null,
      paymentAmount: invoice.paymentAmount,
      order: invoice.order,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const invoice = this.createFromForm();
    if (invoice.id !== undefined) {
      this.subscribeToSaveResponse(this.invoiceService.update(invoice));
    } else {
      this.subscribeToSaveResponse(this.invoiceService.create(invoice));
    }
  }

  private createFromForm(): IInvoice {
    return {
      ...new Invoice(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? moment(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      details: this.editForm.get(['details'])!.value,
      status: this.editForm.get(['status'])!.value,
      paymentMethod: this.editForm.get(['paymentMethod'])!.value,
      paymentDate: this.editForm.get(['paymentDate'])!.value
        ? moment(this.editForm.get(['paymentDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      paymentAmount: this.editForm.get(['paymentAmount'])!.value,
      order: this.editForm.get(['order'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInvoice>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IProductOrder): any {
    return item.id;
  }
}

import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../../../models/Dialog-data';

@Component({
  selector: 'app-dialogo',
  imports: [MatDialogModule, MatButtonModule, NgIf],
  templateUrl: './dialogo.component.html',
  styleUrl: './dialogo.component.css'
})
export class DialogoComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Usuario aceptó
  }

  onCancel(): void {
    this.dialogRef.close(false); // Usuario canceló
  }
}

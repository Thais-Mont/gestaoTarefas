import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskInterface } from '../../interfaces/task.interface';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; 

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgxChartsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css'],
})
export class StatisticComponent {
  chartData: any[] = [];
  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  }
  startDate = new FormControl(new Date().toISOString().split('T')[0]);
  endDate = new FormControl(new Date().toISOString().split('T')[0]);

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.startDate.setValue(thirtyDaysAgo.toISOString().split('T')[0]);
    this.endDate.setValue(today.toISOString().split('T')[0]);

    this.loadChartData();
  }




  onDateRangeApply(dateRangeInput: any): void {
    this.startDate.setValue(dateRangeInput.value.start.toISOString().split('T')[0]);
    this.endDate.setValue(dateRangeInput.value.end.toISOString().split('T')[0]);
    this.loadChartData();
  }

  translateStatus(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'inProgress':
        return 'Em andamento';
      case 'completed':
        return 'Concluída';
      default:
        return 'Desconhecido';
    }
  }

  loadChartData(): void {
    const startDateValue = this.startDate.value;
    const endDateValue = this.endDate.value;

    if (startDateValue && endDateValue) {
      const startDateISO = new Date(startDateValue).toISOString();
      const endDateISO = new Date(endDateValue).toISOString();

      this.taskService.getTasksByDateRange(startDateISO, endDateISO).subscribe({
        next: (tasks: TaskInterface[]) => {
          const statusCounts: { [key: string]: number } = {};

          tasks.forEach((task) => {
            if (task.status) {
              statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
            }
          });

          this.chartData = Object.keys(statusCounts).map((status) => ({
            name: this.translateStatus(status),
            value: statusCounts[status],
          }));
        },
        error: (err) => console.error('Erro ao carregar tarefas:', err),
      });
    }
  }
}

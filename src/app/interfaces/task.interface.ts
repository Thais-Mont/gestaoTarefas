export interface TaskInterface {
    id?: string;
    title: string;              
    description: string;         
    dueDate: string;             // Data de vencimento (ISO format, e.g., 'YYYY-MM-DD')
    responsibleCpf: string;     
    responsibleEmail: string;    
    responsibleName: string;    
    status: 'pending' | 'inProgress' | 'completed'; 
  }
  
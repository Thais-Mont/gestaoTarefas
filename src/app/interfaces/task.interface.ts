export interface TaskInterface {
    id?: string;
    title: string;              
    description: string;         
    dueDate: string;           
    responsibleCpf: string;     
    responsibleEmail: string;    
    responsibleName: string;    
    status: 'pending' | 'inProgress' | 'completed'; 
  }
  
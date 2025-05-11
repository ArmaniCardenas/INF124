import React from 'react';
import { Button } from '../../../components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function DocumentsPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <img src='/empty.png' height="300" width="300" alt='empty' 
      className='dark:hidden'>
      </img>

      <img src='/empty-dark.png' height="300" width="300" alt='empty' 
      className='hidden dark:block'>
      </img>

      <h2 className='text-lg font-medium'>
        Welcome to Lotion
      </h2>
      <Button className='bg-black text-white'>
        <PlusCircle className='text-white h-4 w-4 mr-2'/>
        Create a Note
      </Button>
      
    </div>
  );
}

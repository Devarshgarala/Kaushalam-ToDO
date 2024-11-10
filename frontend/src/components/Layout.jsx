import React from 'react';
import TaskIndicator from './TaskIndicator';
import CreateTask from './createTask/CreateTask';
import { Outlet } from 'react-router-dom';
function Layout() {
    return (
        <div className="bg-white min-h-screen">
            <div className='flex flex-col md:flex-row md:justify-between bg-white p-4'>
                <CreateTask />
                <div className='task-container w-auto mx-5 md:w-1/3 mt-3 bg-gray-100 rounded-lg shadow-md p-4'>
                    <div className='outlet'>
                        <Outlet />
                    </div>
                    <div className='indicator border-t-2 mt-4 pt-4'>
                        <TaskIndicator />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
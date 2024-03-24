import mongoose, { Document, Model } from 'mongoose';
import { HolidayRequest } from '../types/types';
import { Types } from 'mongoose';

import { RequestInterface, RequestModel } from './models';

export class RequestWorker {

  async createRequest(data: Partial<RequestInterface>): Promise<RequestInterface> {
    try {
      const newRequest = await RequestModel.create(data);
      console.log(`Request for employee ${data.employee_id} created successfully.`);
      return newRequest;
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  }

  async getRequestById(id: Types.ObjectId): Promise<RequestInterface | null> {
    try {
      const request = await RequestModel.findById(id);
      return request;
    } catch (error) {
      console.error('Error getting request by ID:', error);
      throw error;
    }
  }

  async readRequestById(id: Types.ObjectId): Promise<RequestInterface | null> {
    try {
      const request = await RequestModel.findById(id);
      return request;
    } catch (error) {
      console.error('Error reading request:', error);
      throw error; // Re-throw for further handling
    }
  }

  async updateRequestById(id: Types.ObjectId, data: Partial<RequestInterface>): Promise<RequestInterface | null> {
    try {
      const updatedRequest = await RequestModel.findByIdAndUpdate(id, data, { new: true });

      if (updatedRequest) {
        console.log(`Request ${id} updated successfully.`);
        return updatedRequest;
      } else {
        console.warn(`Request with ID ${id} not found.`);
        return null;
      }
    } catch (error) {
      console.error('Error updating request:', error);
      throw error; // Re-throw for further handling
    }
  }

  async deleteRequestById(id: Types.ObjectId): Promise<RequestInterface | null> {
    try {
      const deletedRequest = await RequestModel.findByIdAndDelete(id);

      if (deletedRequest) {
        console.log(`Request ${id} deleted successfully.`);
        return deletedRequest;
      } else {
        console.warn(`Request with ID ${id} not found.`);
        return null;
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      throw error; // Re-throw for further handling
    }
  }

  async findAllRequests(): Promise<RequestInterface[]> {
    try {
      const requests = await RequestModel.find();
      return requests;
    } catch (error) {
      console.error('Error finding requests:', error);
      throw error; // Re-throw for further handling
    }
  }

  async findRequestsByEmployeeId(employee_id: Types.ObjectId): Promise<RequestInterface[]> {
    try {
      const requests = await RequestModel.find({ employee_id });
      return requests;
    } catch (error) {
      console.error('Error finding requests by employee ID:', error);
      throw error;
    }
  }
}

export const requestWorker = new RequestWorker();

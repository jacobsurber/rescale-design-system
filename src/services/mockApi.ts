// =============================================================================
// Mock API Service - Simulates Rescale API endpoints with realistic data
// =============================================================================

import { 
  Job, 
  JobStatus, 
  JobPriority, 
  Workstation, 
  Workflow, 
  PaginatedResponse, 
  PaginationParams,
  JobFilters,
  CreateJobRequest,
  UpdateJobRequest,
  SoftwarePackage,
  Workspace,
  User
} from '../types/api';

// Mock data generators
const generateId = () => Math.random().toString(36).substr(2, 9);

const jobStatuses: JobStatus[] = ['queued', 'pending', 'running', 'completed', 'failed', 'cancelled', 'warning'];
const jobPriorities: JobPriority[] = ['low', 'normal', 'high', 'urgent'];

const softwarePackages: SoftwarePackage[] = [
  { id: 'ansys-fluent', name: 'ANSYS Fluent', version: '2024.1', category: 'CFD', logoUrl: '/logos/ansys.png' },
  { id: 'abaqus', name: 'Abaqus', version: '2023.3', category: 'FEA', logoUrl: '/logos/abaqus.png' },
  { id: 'matlab', name: 'MATLAB', version: 'R2024a', category: 'Numerical Computing', logoUrl: '/logos/matlab.png' },
  { id: 'openfoam', name: 'OpenFOAM', version: '11', category: 'CFD', logoUrl: '/logos/openfoam.png' },
  { id: 'nastran', name: 'MSC Nastran', version: '2024', category: 'FEA', logoUrl: '/logos/nastran.png' },
  { id: 'star-ccm', name: 'STAR-CCM+', version: '2024.1', category: 'CFD', logoUrl: '/logos/starccm.png' },
];

const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Aerospace Engineering',
    description: 'CFD and structural analysis for aerospace applications',
    logoUrl: '/logos/aerospace.png',
    members: [],
    settings: {
      defaultPriority: 'normal',
      autoShutdown: true,
      maxJobDuration: 1440,
      allowedSoftware: ['ansys-fluent', 'abaqus', 'star-ccm']
    },
    quotas: {
      maxCores: 1000,
      maxMemory: 2000,
      maxStorage: 5000,
      maxJobs: 50,
      maxWorkstations: 10
    },
    usage: {
      cores: { used: 240, total: 1000 },
      memory: { used: 512, total: 2000 },
      storage: { used: 1250, total: 5000 },
      jobs: { running: 12, total: 45 },
      workstations: { active: 3, total: 8 }
    },
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'ws-2', 
    name: 'Automotive R&D',
    description: 'Vehicle dynamics and crash simulation',
    members: [],
    settings: {
      defaultPriority: 'high',
      autoShutdown: true,
      maxJobDuration: 2880,
      allowedSoftware: ['abaqus', 'nastran', 'matlab']
    },
    quotas: {
      maxCores: 500,
      maxMemory: 1000,
      maxStorage: 3000,
      maxJobs: 30,
      maxWorkstations: 5
    },
    usage: {
      cores: { used: 128, total: 500 },
      memory: { used: 256, total: 1000 },
      storage: { used: 850, total: 3000 },
      jobs: { running: 8, total: 25 },
      workstations: { active: 2, total: 5 }
    },
    createdAt: '2024-02-01T10:30:00Z'
  }
];

// Generate mock jobs
const generateMockJob = (id: string, overrides: Partial<Job> = {}): Job => {
  const status = jobStatuses[Math.floor(Math.random() * jobStatuses.length)];
  const priority = jobPriorities[Math.floor(Math.random() * jobPriorities.length)];
  const software = softwarePackages.slice(0, Math.floor(Math.random() * 3) + 1);
  
  const submittedAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
  const startedAt = status !== 'queued' ? new Date(new Date(submittedAt).getTime() + Math.random() * 60 * 60 * 1000).toISOString() : undefined;
  const completedAt = ['completed', 'failed', 'cancelled'].includes(status) 
    ? new Date(new Date(startedAt || submittedAt).getTime() + Math.random() * 4 * 60 * 60 * 1000).toISOString()
    : undefined;

  return {
    id,
    name: `${software[0].name} Simulation ${id.slice(-4).toUpperCase()}`,
    description: `High-fidelity simulation using ${software.map(s => s.name).join(', ')}`,
    status,
    priority,
    progress: status === 'completed' ? 100 : status === 'running' ? Math.floor(Math.random() * 80) + 10 : 0,
    estimatedDuration: Math.floor(Math.random() * 480) + 60, // 1-8 hours
    actualDuration: completedAt ? Math.floor((new Date(completedAt).getTime() - new Date(startedAt || submittedAt).getTime()) / 1000 / 60) : undefined,
    submittedAt,
    startedAt,
    completedAt,
    userId: 'user-123',
    workspaceId: mockWorkspaces[Math.floor(Math.random() * mockWorkspaces.length)].id,
    software,
    resources: {
      cores: Math.floor(Math.random() * 32) + 1,
      memory: Math.floor(Math.random() * 128) + 8,
      storage: Math.floor(Math.random() * 500) + 50,
      gpus: Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : undefined,
      nodeType: ['c5.xlarge', 'c5.2xlarge', 'c5.4xlarge', 'c5.8xlarge'][Math.floor(Math.random() * 4)],
      maxWallTime: Math.floor(Math.random() * 1440) + 60
    },
    files: [
      {
        id: 'file-1',
        name: 'simulation_input.dat',
        path: '/inputs/simulation_input.dat', 
        size: Math.floor(Math.random() * 1024 * 1024 * 100), // Up to 100MB
        type: 'input',
        uploadedAt: submittedAt
      },
      {
        id: 'file-2',
        name: 'mesh.msh',
        path: '/inputs/mesh.msh',
        size: Math.floor(Math.random() * 1024 * 1024 * 500), // Up to 500MB
        type: 'input',
        uploadedAt: submittedAt
      }
    ],
    parameters: [
      { key: 'iterations', value: Math.floor(Math.random() * 1000) + 100, type: 'number' },
      { key: 'tolerance', value: 0.001, type: 'number' },
      { key: 'solver_type', value: 'implicit', type: 'string' }
    ],
    metrics: status === 'running' ? {
      cpuUsage: Math.floor(Math.random() * 40) + 60,
      memoryUsage: Math.floor(Math.random() * 30) + 50,
      storageUsage: Math.floor(Math.random() * 20) + 20,
      networkUsage: Math.floor(Math.random() * 100) + 10,
      timestamp: new Date().toISOString()
    } : undefined,
    ...overrides
  };
};

// Generate mock data
const mockJobs: Job[] = Array.from({ length: 150 }, (_, i) => generateMockJob(`job-${i + 1}`));

const mockWorkstations: Workstation[] = Array.from({ length: 25 }, (_, i) => ({
  id: `ws-${i + 1}`,
  name: `Workstation ${i + 1}`,
  description: `High-performance workstation for computational tasks`,
  status: ['active', 'inactive', 'maintenance'][Math.floor(Math.random() * 3)] as any,
  nodeType: ['c5.2xlarge', 'c5.4xlarge', 'c5.8xlarge', 'c5.16xlarge'][Math.floor(Math.random() * 4)],
  specs: {
    cores: [8, 16, 32, 64][Math.floor(Math.random() * 4)],
    memory: [16, 32, 64, 128][Math.floor(Math.random() * 4)],
    storage: [100, 200, 500, 1000][Math.floor(Math.random() * 4)],
    gpus: Math.random() > 0.6 ? [1, 2, 4][Math.floor(Math.random() * 3)] : undefined,
    os: 'Ubuntu 22.04 LTS'
  },
  usage: {
    cpu: Math.floor(Math.random() * 80) + 10,
    memory: Math.floor(Math.random() * 70) + 20,
    storage: Math.floor(Math.random() * 50) + 10,
    network: Math.floor(Math.random() * 100) + 5
  },
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  lastAccessedAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined
}));

const mockWorkflows: Workflow[] = Array.from({ length: 20 }, (_, i) => ({
  id: `wf-${i + 1}`,
  name: `Workflow ${i + 1}`,
  description: `Automated workflow for ${['CFD Analysis', 'Structural Analysis', 'Multi-physics Simulation', 'Optimization Study'][Math.floor(Math.random() * 4)]}`,
  version: `1.${Math.floor(Math.random() * 10)}`,
  status: ['draft', 'published', 'deprecated'][Math.floor(Math.random() * 3)] as any,
  tags: ['cfd', 'structural', 'optimization', 'automation'].slice(0, Math.floor(Math.random() * 3) + 1),
  steps: [],
  createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  createdBy: 'user-123'
}));

// API delay simulation
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API implementation
export class MockApiService {
  private static instance: MockApiService;
  
  static getInstance(): MockApiService {
    if (!MockApiService.instance) {
      MockApiService.instance = new MockApiService();
    }
    return MockApiService.instance;
  }

  // Jobs endpoints
  async getJobs(
    params: PaginationParams & { filters?: JobFilters } = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<Job>> {
    await delay(300 + Math.random() * 200); // Simulate network delay
    
    let filteredJobs = [...mockJobs];
    
    // Apply filters
    if (params.filters) {
      const { status, priority, workspaceId, userId, softwareIds, dateFrom, dateTo, search } = params.filters;
      
      if (status?.length) {
        filteredJobs = filteredJobs.filter(job => status.includes(job.status));
      }
      
      if (priority?.length) {
        filteredJobs = filteredJobs.filter(job => priority.includes(job.priority));
      }
      
      if (workspaceId) {
        filteredJobs = filteredJobs.filter(job => job.workspaceId === workspaceId);
      }
      
      if (userId) {
        filteredJobs = filteredJobs.filter(job => job.userId === userId);
      }
      
      if (softwareIds?.length) {
        filteredJobs = filteredJobs.filter(job => 
          job.software.some(sw => softwareIds.includes(sw.id))
        );
      }
      
      if (dateFrom) {
        filteredJobs = filteredJobs.filter(job => new Date(job.submittedAt) >= new Date(dateFrom));
      }
      
      if (dateTo) {
        filteredJobs = filteredJobs.filter(job => new Date(job.submittedAt) <= new Date(dateTo));
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.name.toLowerCase().includes(searchLower) ||
          job.description?.toLowerCase().includes(searchLower) ||
          job.software.some(sw => sw.name.toLowerCase().includes(searchLower))
        );
      }
    }
    
    // Apply sorting
    if (params.sort) {
      filteredJobs.sort((a, b) => {
        let aVal: any = a[params.sort as keyof Job];
        let bVal: any = b[params.sort as keyof Job];
        
        if (params.sort === 'submittedAt' || params.sort === 'startedAt' || params.sort === 'completedAt') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        
        if (params.order === 'desc') {
          return bVal - aVal;
        }
        return aVal - bVal;
      });
    }
    
    // Apply pagination
    const total = filteredJobs.length;
    const totalPages = Math.ceil(total / params.limit);
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    const data = filteredJobs.slice(start, end);
    
    return {
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
        hasNext: params.page < totalPages,
        hasPrevious: params.page > 1
      }
    };
  }

  async getJob(id: string): Promise<Job> {
    await delay(150 + Math.random() * 100);
    
    const job = mockJobs.find(j => j.id === id);
    if (!job) {
      throw new Error(`Job ${id} not found`);
    }
    
    return job;
  }

  async createJob(request: CreateJobRequest): Promise<Job> {
    await delay(500 + Math.random() * 300);
    
    const software = softwarePackages.filter(sw => request.softwareIds.includes(sw.id));
    const newJob = generateMockJob(generateId(), {
      name: request.name,
      description: request.description,
      workspaceId: request.workspaceId,
      software,
      resources: request.resources,
      parameters: request.parameters,
      priority: request.priority || 'normal',
      status: 'queued',
      progress: 0,
      submittedAt: new Date().toISOString()
    });
    
    mockJobs.unshift(newJob);
    return newJob;
  }

  async updateJob(id: string, request: UpdateJobRequest): Promise<Job> {
    await delay(300 + Math.random() * 200);
    
    const jobIndex = mockJobs.findIndex(j => j.id === id);
    if (jobIndex === -1) {
      throw new Error(`Job ${id} not found`);
    }
    
    mockJobs[jobIndex] = {
      ...mockJobs[jobIndex],
      ...request,
      parameters: request.parameters || mockJobs[jobIndex].parameters
    };
    
    return mockJobs[jobIndex];
  }

  async deleteJob(id: string): Promise<void> {
    await delay(200 + Math.random() * 100);
    
    const jobIndex = mockJobs.findIndex(j => j.id === id);
    if (jobIndex === -1) {
      throw new Error(`Job ${id} not found`);
    }
    
    mockJobs.splice(jobIndex, 1);
  }

  // Workstations endpoints
  async getWorkstations(): Promise<Workstation[]> {
    await delay(200 + Math.random() * 100);
    return mockWorkstations;
  }

  // Workflows endpoints
  async getWorkflows(): Promise<Workflow[]> {
    await delay(250 + Math.random() * 150);
    return mockWorkflows;
  }

  // Software endpoints
  async getSoftwarePackages(): Promise<SoftwarePackage[]> {
    await delay(100 + Math.random() * 50);
    return softwarePackages;
  }

  // Workspaces endpoints
  async getWorkspaces(): Promise<Workspace[]> {
    await delay(150 + Math.random() * 100);
    return mockWorkspaces;
  }

  // Simulate real-time job status updates
  simulateJobStatusUpdate(jobId: string): Job | null {
    const job = mockJobs.find(j => j.id === jobId);
    if (!job || job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') {
      return null;
    }

    if (job.status === 'running') {
      // Update progress
      job.progress = Math.min(100, job.progress + Math.floor(Math.random() * 5) + 1);
      
      // Update metrics
      job.metrics = {
        cpuUsage: Math.max(20, Math.min(100, (job.metrics?.cpuUsage || 60) + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(10, Math.min(90, (job.metrics?.memoryUsage || 50) + (Math.random() - 0.5) * 5)),
        storageUsage: Math.max(5, Math.min(80, (job.metrics?.storageUsage || 20) + (Math.random() - 0.5) * 2)),
        networkUsage: Math.max(0, Math.min(200, (job.metrics?.networkUsage || 50) + (Math.random() - 0.5) * 20)),
        timestamp: new Date().toISOString()
      };
      
      // Randomly complete job
      if (job.progress >= 100 || Math.random() < 0.02) {
        job.status = Math.random() < 0.9 ? 'completed' : 'failed';
        job.progress = job.status === 'completed' ? 100 : job.progress;
        job.completedAt = new Date().toISOString();
      }
    } else if (job.status === 'queued' && Math.random() < 0.1) {
      job.status = 'running';
      job.startedAt = new Date().toISOString();
      job.progress = 1;
    }

    return job;
  }
}

export const mockApi = MockApiService.getInstance();
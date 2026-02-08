import { Octokit } from '@octokit/rest';
import logger from '../config/logger';
import env from '../config/env';

export class GitHubService {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    });
  }

  async listRepositories(): Promise<any[]> {
    try {
      const { data } = await this.octokit.repos.listForAuthenticatedUser({
        per_page: 100,
        sort: 'updated',
      });
      return data;
    } catch (error: any) {
      logger.error('Error listing repositories:', error);
      throw new Error(`Failed to list repositories: ${error.message}`);
    }
  }

  async getRepository(owner: string, repo: string): Promise<any> {
    try {
      const { data } = await this.octokit.repos.get({
        owner,
        repo,
      });
      return data;
    } catch (error: any) {
      logger.error('Error getting repository:', error);
      throw new Error(`Failed to get repository: ${error.message}`);
    }
  }

  async listBranches(owner: string, repo: string): Promise<any[]> {
    try {
      const { data } = await this.octokit.repos.listBranches({
        owner,
        repo,
        per_page: 100,
      });
      return data;
    } catch (error: any) {
      logger.error('Error listing branches:', error);
      throw new Error(`Failed to list branches: ${error.message}`);
    }
  }

  async triggerWorkflow(
    owner: string,
    repo: string,
    workflowId: string,
    ref: string,
    inputs?: Record<string, string>
  ): Promise<any> {
    try {
      const { data } = await this.octokit.actions.createWorkflowDispatch({
        owner,
        repo,
        workflow_id: workflowId,
        ref,
        inputs: inputs || {},
      });
      return data;
    } catch (error: any) {
      logger.error('Error triggering workflow:', error);
      throw new Error(`Failed to trigger workflow: ${error.message}`);
    }
  }

  async getWorkflowRun(owner: string, repo: string, runId: number): Promise<any> {
    try {
      const { data } = await this.octokit.actions.getWorkflowRun({
        owner,
        repo,
        run_id: runId,
      });
      return data;
    } catch (error: any) {
      logger.error('Error getting workflow run:', error);
      throw new Error(`Failed to get workflow run: ${error.message}`);
    }
  }

  async listWorkflowRuns(
    owner: string,
    repo: string,
    workflowId?: string
  ): Promise<any[]> {
    try {
      const params: any = {
        owner,
        repo,
        per_page: 30,
      };
      if (workflowId) {
        params.workflow_id = workflowId;
      }
      const { data } = await this.octokit.actions.listWorkflowRuns(params);
      return data.workflow_runs;
    } catch (error: any) {
      logger.error('Error listing workflow runs:', error);
      throw new Error(`Failed to list workflow runs: ${error.message}`);
    }
  }

  async downloadArtifact(
    owner: string,
    repo: string,
    artifactId: number
  ): Promise<ArrayBuffer> {
    try {
      const { data } = await this.octokit.actions.downloadArtifact({
        owner,
        repo,
        artifact_id: artifactId,
        archive_format: 'zip',
      });
      return data as unknown as ArrayBuffer;
    } catch (error: any) {
      logger.error('Error downloading artifact:', error);
      throw new Error(`Failed to download artifact: ${error.message}`);
    }
  }

  async listArtifacts(owner: string, repo: string, runId: number): Promise<any[]> {
    try {
      const { data } = await this.octokit.actions.listWorkflowRunArtifacts({
        owner,
        repo,
        run_id: runId,
      });
      return data.artifacts;
    } catch (error: any) {
      logger.error('Error listing artifacts:', error);
      throw new Error(`Failed to list artifacts: ${error.message}`);
    }
  }

  async createWebhook(
    owner: string,
    repo: string,
    url: string,
    secret: string,
    events: string[]
  ): Promise<any> {
    try {
      const { data } = await this.octokit.repos.createWebhook({
        owner,
        repo,
        config: {
          url,
          content_type: 'json',
          secret,
        },
        events,
        active: true,
      });
      return data;
    } catch (error: any) {
      logger.error('Error creating webhook:', error);
      throw new Error(`Failed to create webhook: ${error.message}`);
    }
  }

  async deleteWebhook(owner: string, repo: string, hookId: number): Promise<void> {
    try {
      await this.octokit.repos.deleteWebhook({
        owner,
        repo,
        hook_id: hookId,
      });
    } catch (error: any) {
      logger.error('Error deleting webhook:', error);
      throw new Error(`Failed to delete webhook: ${error.message}`);
    }
  }
}

export default GitHubService;


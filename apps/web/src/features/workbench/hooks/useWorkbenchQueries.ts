import { useQuery } from '@tanstack/react-query';

import { api } from '../../../lib/api.js';

export const useWorkbenchQueries = () => {
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: api.getHealth,
    refetchInterval: 15_000,
  });

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: api.getProjects,
  });

  const nodeCatalogQuery = useQuery({
    queryKey: ['node-catalog'],
    queryFn: api.getNodeCatalog,
  });

  return {
    healthQuery,
    projectsQuery,
    nodeCatalogQuery,
  };
};

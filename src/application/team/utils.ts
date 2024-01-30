export const getFirstParentTeamIdFromTeamPath = (path: string): string => {
  const pathChunks = path.split(",");
  const parentId = pathChunks[pathChunks.length - 2];
  return parentId;
};

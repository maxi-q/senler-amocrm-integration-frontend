export const transformDataToListMessage = (senlerGroupId: string) => {
  const id = Date.now() + Math.round(Math.random() * 9999);
  const data = {
    id,
    request: {
      type: "CallApiMethod",
      method: `/vars/list?group_id=${senlerGroupId}`,
    },
    time: Date.now(),
  };

  return data
}

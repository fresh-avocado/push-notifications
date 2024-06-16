export const load = async ({ cookies }) => {
  return {
    name: cookies.get('name') ?? '',
  };
};
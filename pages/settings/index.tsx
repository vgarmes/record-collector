import { NextPage } from 'next';
import { trpc } from '../../utils/trpc';

const Settings: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(['user.session']);
  console.log(data);
  return <>Settings page</>;
};

export default Settings;

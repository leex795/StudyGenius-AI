import { requireUser } from "../../lib/auth";
import { HomeDashboard } from "../../components/HomeDashboard";

export default async function AppPage(){
  const user=await requireUser();
  return <HomeDashboard name={user.name || user.email.split("@")[0]} />;
}

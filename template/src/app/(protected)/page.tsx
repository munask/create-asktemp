import { Card } from "@/components/ui/card";
import locals from "@/locals";
export default function Home() {
  return (
    <div className="flex justify-center items-center  ">
      <Card className="p-2 font-bold">
        {locals.homepage}
        <br/>
        {locals.underdev}
      </Card>
    </div>
  );
}

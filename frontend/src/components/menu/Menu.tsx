import { SegmentedControl } from "../myUi/segmented-control/SegmentedControl";

export function Menu({className, idApp }: {className: string, idApp: any}) {
  return (
    <div className={`flex flex-col items-center justify-between p-6 sticky top-0 z-999999 ${className}`}>
      <SegmentedControl items={['LOBBY', 'MOVIE', 'MATCH']} idApp={idApp}></SegmentedControl>
    </div>
  );
}

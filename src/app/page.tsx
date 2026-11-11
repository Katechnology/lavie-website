import Stage from "@/components/stage/Stage";
import SmoothScroll from "@/components/chrome/SmoothScroll";
import Loader from "@/components/chrome/Loader";
import { BottomPill, SceneRail, TopNav } from "@/components/chrome/Chrome";
import Hero from "@/components/sections/Hero";
import Levels from "@/components/sections/Levels";
import KanaPond from "@/components/sections/KanaPond";
import Letter from "@/components/sections/Letter";
import Classes from "@/components/sections/Classes";
import Footer from "@/components/sections/Footer";
import Grain from "@/components/Grain";
import ClickBloom from "@/components/fx/ClickBloom";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Loader />
      <Stage />
      {/* a breath of film grain ties the painted video frames together */}
      <Grain opacity={0.06} zIndex={1} />
      <TopNav />
      <SceneRail />
      <BottomPill />
      <main className="relative z-[2] overflow-x-clip">
        <Hero />
        <Levels />
        <KanaPond />
        <Letter />
        <Classes />
      </main>
      <Footer />
      <ClickBloom />
    </>
  );
}

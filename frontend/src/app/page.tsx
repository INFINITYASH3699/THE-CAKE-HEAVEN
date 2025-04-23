// src/app/page.tsx
import StoryComponent from "@/components/home/StoryComponent";
import BannerSlider from "@/components/home/BannerSlider";
import UserSatisfaction from "@/components/home/UserSatisfaction";
import FlavorSection from "@/components/home/FlavorSection";
import ShapeSection from "@/components/home/ShapeSection";
import OccasionSection from "@/components/home/OccasionSection";
import CakeTypeSection from "@/components/home/CakeTypeSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function Home() {
  return (
    <>
      <StoryComponent />
      <BannerSlider />
      <FeaturedProducts />
      <UserSatisfaction />
      <FlavorSection />
      <ShapeSection />
      <OccasionSection />
      <CakeTypeSection />
    </>
  );
}

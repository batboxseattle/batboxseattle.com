import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

Swiper.use([Navigation, Pagination]);

document.addEventListener("DOMContentLoaded", async () => {
  const swiperWrapper = document.querySelector(".swiper-wrapper");

  if (!swiperWrapper) {
    // don't run at all if there's no swiper on the page
    return;
  }

  const pressPhotoFileNames: string[] = (
    await (await fetch("carousel/press-photos.json")).json()
  ).images;

  pressPhotoFileNames.forEach((pressPhotoFileName) => {
    const swiperSlide = document.createElement("div");
    swiperSlide.className = "swiper-slide";

    const img = document.createElement("img");
    img.className = "swiper-image";
    img.src = `https://batboxseattle-assets.s3.us-west-2.amazonaws.com/media/press-photos/${pressPhotoFileName}`;
    img.alt = "Press photo of the members of Batbox.";

    swiperSlide.appendChild(img);
    swiperWrapper.appendChild(swiperSlide);
  });

  // force the DOM to reflow so Swiper can see the updated structure
  await new Promise((resolve) => setTimeout(resolve, 0));

  const swiper = new Swiper(".swiper", {
    direction: "horizontal",
    loop: true,

    pagination: {
      el: ".swiper-pagination",
    },

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    scrollbar: {
      el: ".swiper-scrollbar",
    },
  });

  const carouselDownloadButton = document.getElementById(
    "carousel-download-button",
  );
  if (!carouselDownloadButton) {
    return;
  }
  carouselDownloadButton.addEventListener("click", () => {
    const currentSlide = swiper.slides[swiper.activeIndex];
    const imageUrl = (currentSlide.children[0] as HTMLImageElement).src;

    // The original URL points towards a compressed image, but we want to download the original one
    // located in the /media/uncompressed folder instead
    const uncompressedImageUrl = imageUrl.replace(
      "/media/",
      "/media/uncompressed/",
    );

    const link = document.createElement("a");
    link.target = "_blank";
    link.href = uncompressedImageUrl;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});

import { format, isAfter } from "date-fns";
import { parse } from "chrono-node";
import { z } from "zod";
import { Heap } from "heap-js";
import { ParsedResult } from "chrono-node/src/types";

const DATE_STRING_SCHEMA = z.string().transform((val, ctx) => {
  const parsedResult: ParsedResult = parse(val)[0];
  if (!parsedResult) {
    ctx.addIssue({
      code: "custom",
      message: "Invalid date string",
    });
    return z.NEVER;
  }
  return {
    date: parsedResult.date(),
    hasTime: parsedResult.start.isCertain("hour"),
  };
});

const SHOWS_SCHEMA = z.object({
  shows: z.array(
    z.object({
      title: z.string(),
      image: z.string(),
      startDate: DATE_STRING_SCHEMA,
      endDate: DATE_STRING_SCHEMA.optional(),
      location: z.string(),
      link: z.string().optional(),
    }),
  ),
});

interface Show {
  title: string;
  image: string;
  startDate: { date: Date; hasTime: boolean };
  endDate?: { date: Date; hasTime: boolean };
  location: string;
  link?: string;
}

function formatDate(dateObj: { date: Date; hasTime: boolean }): string {
  const { date, hasTime } = dateObj;
  return hasTime
    ? format(date, "EEEE, MMMM do 'at' h:mm a")
    : format(date, "EEEE, MMMM do");
}

function createShowElement(show: Show, isUpcoming: boolean): HTMLElement {
  const showContainer = document.createElement("div");
  showContainer.className = "show-container";

  const img = document.createElement("img");
  img.className = "show-flyer";
  img.src = show.image;
  img.alt = "Flyer for show featuring event details, date, time, and venue.";

  const details = document.createElement("div");
  details.className = "show-details";

  const title = document.createElement("h2");
  title.className = "punk";
  title.textContent = show.title;

  const date = document.createElement("p");
  date.innerHTML = `${formatDate(show.startDate)}${show.endDate ? ` - ${formatDate(show.endDate)}` : ""}<br>${show.location}`;

  details.appendChild(title);
  details.appendChild(date);

  if (isUpcoming && show.link) {
    const link = document.createElement("a");
    link.className = "button-link punk";
    link.href = show.link;
    link.textContent = "See details";
    link.target = "_blank";
    link.rel = "noopener";
    details.appendChild(link);
  }

  showContainer.appendChild(img);
  showContainer.appendChild(details);

  return showContainer;
}

function createSpacerElement(): HTMLElement {
  const spacerElement = document.createElement("div");
  spacerElement.className = "spacer";
  return spacerElement;
}

async function populateShows() {
  const upcomingShowsContainer = document.getElementById("upcoming-shows");
  const pastShowsContainer = document.getElementById("past-shows");

  if (!upcomingShowsContainer && !pastShowsContainer) {
    // don't run at all if there aren't any containers to put shows into
    return;
  }

  const shows = SHOWS_SCHEMA.parse(
    await (await fetch("shows/shows.json")).json(),
  ).shows;
  const now = new Date();

  // earliest show first
  const upcomingShows = new Heap<Show>(
    (show1, show2) =>
      show1.startDate.date.getTime() - show2.startDate.date.getTime(),
  );
  // latest show first
  const pastShows = new Heap<Show>(
    (show1, show2) =>
      show2.startDate.date.getTime() - show1.startDate.date.getTime(),
  );

  shows.forEach((show) => {
    if (isAfter(show.startDate.date, now)) {
      upcomingShows.add(show);
    } else {
      pastShows.add(show);
    }
  });

  if (upcomingShows.length == 0) {
    const showContainer = document.createElement("div");
    showContainer.className = "show-container";
    const message = document.createElement("p");
    message.textContent = "Nothing scheduled, but check back soon!";
    showContainer.appendChild(message);
    upcomingShowsContainer?.appendChild(showContainer);
  }

  let isFirst = true;
  for (const show of upcomingShows) {
    if (!isFirst) {
      upcomingShowsContainer?.appendChild(createSpacerElement());
    }
    isFirst = false;
    upcomingShowsContainer?.appendChild(createShowElement(show, true));
  }

  isFirst = true;
  for (const show of pastShows) {
    if (!isFirst) {
      pastShowsContainer?.appendChild(createSpacerElement());
    }
    isFirst = false;
    pastShowsContainer?.appendChild(createShowElement(show, false));
  }
}

document.addEventListener("DOMContentLoaded", populateShows);

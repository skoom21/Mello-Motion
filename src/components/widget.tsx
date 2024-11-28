"use client";

import React, { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import RGL, { WidthProvider, Layout } from "react-grid-layout";
import { Pencil } from "lucide-react";

import RecentlyPlayedCard from "./dashboard/RecentlyPlayedCard";
import MentalWellnessCard from "./dashboard/Mental";
import MoodCard from "./dashboard/Mood";
import Playlist from "./dashboard/playlists";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ReactGridLayout = WidthProvider(RGL);

type Widget = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  component: React.ReactNode;
};

const moodData = [
  { time: "Morning", mood: 6 },
  { time: "Afternoon", mood: 8 },
  { time: "Evening", mood: 7 },
  { time: "Night", mood: 9 },
];

const mentalHealthData = [
  { day: "Mon", score: 65 },
  { day: "Tue", score: 70 },
  { day: "Wed", score: 68 },
  { day: "Thu", score: 72 },
  { day: "Fri", score: 75 },
  { day: "Sat", score: 80 },
  { day: "Sun", score: 78 },
];

export default function Widget() {
  const initialWidgets: Widget[] = [
    {
      i: "n1",
      x: 0,
      y: 0,
      w: 4,
      h: 16,
      component: <RecentlyPlayedCard />,
    },
    {
      i: "n2",
      x: 4,
      y: 0,
      w: 6,
      h: 6,
      component: (
        <MoodCard
          hoveredCard={null}
          setHoveredCard={() => {}}
          moodData={moodData}
        />
      ),
    },
    {
      i: "n3",
      x: 8,
      y: 0,
      w: 6,
      h: 6,
      component: (
        <MentalWellnessCard
          hoveredCard={null}
          setHoveredCard={() => {}}
          mentalHealthData={mentalHealthData}
        />
      ),
    },
    {
      i: "n4",
      x: 0,
      y: 3,
      w: 20,
      h: 14,
      component: (
        <Playlist
          hoveredCard={null}
          setHoveredCard={() => {}}
        />
      ),
    },
  ];

  const [layout, setLayout] = useState<Layout[]>(initialWidgets.map(({ i, x, y, w, h }) => ({ i, x, y, w, h })));
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [isEditMode, setIsEditMode] = useState(false);
  const { setNodeRef } = useDroppable({ id: "droppable" });

  return (
    <div>
      <div className="absolute top right-">
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className="p-2 bg-white text-purple-500 rounded-full"
        >
          <Pencil />
        </button>
      </div>
      {isEditMode ? (
        <DndContext onDragEnd={(event: { over: any; active: any; }) => {
          const { over, active } = event;
          if (over && over.id === "droppable") {
            // Handle drag end
          }
        }}>
          <div className="p-4">
            <div ref={setNodeRef} className="border-2 border-dashed border-gray-300 p-4">
              <ReactGridLayout
                layout={layout}
                cols={12}
                rowHeight={20}
                width={1200}
                onLayoutChange={(newLayout: React.SetStateAction<Layout[]>) => setLayout(newLayout)}
              >
                {widgets.map((widget) => (
                  <div
                    key={widget.i}
                    className="border-0 border-gray-300 rounded-md p-2"
                    style={{
                      gridColumn: `span ${widget.w}`,
                      gridRow: `span ${widget.h}`,
                    }}
                  >
                    {widget.component}
                  </div>
                ))}
              </ReactGridLayout>
            </div>
          </div>
        </DndContext>
      ) : (
        <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          <RecentlyPlayedCard />
          <MoodCard
            hoveredCard={null}
            setHoveredCard={() => {}}
            moodData={moodData}
          />
          <MentalWellnessCard
            mentalHealthData={mentalHealthData}
            hoveredCard={null}
            setHoveredCard={() => {}}
          />
          <Playlist
            hoveredCard={null}
            setHoveredCard={() => {}}
          />
        </div>
      )}
    </div>
  );
}

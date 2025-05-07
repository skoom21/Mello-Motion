import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock dependencies
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { accessToken: "mock-token" }, status: "authenticated" }),
}));

// Mock ResizeObserver to fix errors in tests using recharts
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Import components
import AcceptPlaylistModal from "@/components/dashboard/AcceptPlaylistModal";
import Discover from "@/components/dashboard/discover";
import MentalWellnessCard from "@/components/dashboard/Mental";
import { MenuItem } from "@/components/dashboard/MenuItem";
import MoodCard from "@/components/dashboard/Mood";
import MyPlaylists from "@/components/dashboard/Myplaylists";
import PlaylistDetails from "@/components/dashboard/PlaylistDetails";
import PlaylistCarousel from "@/components/dashboard/playlists";
import RecentlyPlayedCard from "@/components/dashboard/RecentlyPlayedCard";
import { SettingsPopover } from "@/components/dashboard/SettingsPopover";

const mockPlaylist = {
  id: "playlist1",
  name: "Test Playlist",
  description: "Test Description",
  image: ["/placeholder.svg"],
  tracks: [
    { id: "track1", name: "Track 1", artist: { name: "Artist 1", mbid: "artist1-mbid", url: "artist1-url" }, duration: 180, playcount: 0, match: 0, url: "", streamable: { "#text": "0", fulltrack: "0" }, mbid: "", "@attr": { rank: "1" }, image: [{ "#text": "/placeholder.svg", size: "medium" }], imageUrl: "/placeholder.svg" },
    { id: "track2", name: "Track 2", artist: { name: "Artist 2", mbid: "artist2-mbid", url: "artist2-url" }, duration: 200, playcount: 0, match: 0, url: "", streamable: { "#text": "0", fulltrack: "0" }, mbid: "", "@attr": { rank: "2" }, image: [{ "#text": "/placeholder.svg", size: "medium" }], imageUrl: "/placeholder.svg" },
  ],
};

describe("Dashboard Components", () => {
  test("AcceptPlaylistModal renders and handles input", () => {
    const mockOnClose = jest.fn();
    render(<AcceptPlaylistModal playlist={mockPlaylist} onClose={mockOnClose} />);
    expect(screen.getByText("Save Playlist")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "New Playlist" } });
    expect(screen.getByLabelText("Name")).toHaveValue("New Playlist");
    fireEvent.click(screen.getByText("Save Playlist"));
  });

  test("Discover component renders and switches tabs", async () => {
    render(<Discover />);
    expect(screen.getByText("Discover New Music")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Artists"));
    await screen.findByText("Artists");
  });

  test("MentalWellnessCard renders with data", () => {
    const mockData = [
      { day: "Mon", score: 80 },
      { day: "Tue", score: 70 },
    ];
    render(<MentalWellnessCard mentalHealthData={mockData} hoveredCard={null} setHoveredCard={jest.fn()} />);
    expect(screen.getByText("Mental Wellness")).toBeInTheDocument();
  });

  test("MenuItem renders and handles click", () => {
    const mockOnClick = jest.fn();
    const menuItemData = { id: "home", icon: "Home" as "Home" | "Headphones" | "Radio" | "Mic" | "Heart", title: "Home" };
    render(<MenuItem item={menuItemData} isActive={false} customColor="#fff" theme="dark" isMenuOpen={true} onClick={mockOnClick} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Home"));
    expect(mockOnClick).toHaveBeenCalled();
  });

  test("MoodCard renders with data", () => {
    const mockMoodData = [
      { time: "Morning", mood: 7 },
      { time: "Afternoon", mood: 8 },
    ];
    render(<MoodCard moodData={mockMoodData} hoveredCard={null} setHoveredCard={jest.fn()} />);
    expect(screen.getByText("Today's Mood")).toBeInTheDocument();
  });

  test("MyPlaylists renders and allows playlist creation", () => {
    render(<MyPlaylists />);
    expect(screen.getByText("Your Playlists")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Create Playlist"));
    expect(screen.getByText("Create New Playlist")).toBeInTheDocument();
  });

  test("PlaylistDetails renders and allows track selection", () => {
    const mockOnTracksUpdate = jest.fn();
    render(<PlaylistDetails playlist={mockPlaylist} onTracksUpdate={mockOnTracksUpdate} />);
    expect(screen.getByText("Test Playlist")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Select All"));
    expect(mockOnTracksUpdate).toHaveBeenCalled();
  });

  test("PlaylistCarousel renders and navigates", () => {
    render(<PlaylistCarousel hoveredCard={null} setHoveredCard={jest.fn()} />);
    expect(screen.getByText("Playlist Recommendations")).toBeInTheDocument();
  });

  test("RecentlyPlayedCard renders", () => {
    render(<RecentlyPlayedCard />);
    expect(screen.getByText("Recently Played")).toBeInTheDocument();
  });

  test("SettingsPopover renders and toggles theme", () => {
    const mockToggleTheme = jest.fn();
    const mockHandleColorChange = jest.fn();
    render(
      <SettingsPopover
        isMenuOpen={true}
        theme="dark"
        customColor="#9C27B0"
        toggleTheme={mockToggleTheme}
        handleColorChange={mockHandleColorChange}
      />
    );
    expect(screen.getByText("Settings")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Theme"));
    expect(mockToggleTheme).toHaveBeenCalled();
  });
});

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as currencyModule from "../utils/country";
import { Flag } from "./Flag";

describe("Flag Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("URL Resolution", () => {
    it("renders fallback local globe icon when country is 'un'", () => {
      render(<Flag currency="XAU" alt="Gold" />);

      const img = screen.getByAltText("Gold");
      expect(img).toHaveAttribute("src", "/globe.svg");
    });

    it("renders FlagCDN SVG URL when country code is valid", () => {
      render(<Flag currency="USD" alt="US Dollar" />);

      const img = screen.getByAltText("US Dollar");
      expect(img).toHaveAttribute("src", "https://flagcdn.com/us.svg");
    });

    it("correctly handles lowercased and multi-letter country codes", () => {
      render(<Flag currency="GBP" alt="British Pound" />);

      const img = screen.getByAltText("British Pound");
      expect(img).toHaveAttribute("src", "https://flagcdn.com/gb.svg");
    });
  });

  describe("Accessibility & Alt Text", () => {
    it("passes non-empty alt text to image", () => {
      render(<Flag currency="EUR" alt="Euro Flag" />);

      const img = screen.getByAltText("Euro Flag");
      expect(img).toBeInTheDocument();
    });

    it("supports empty alt string for decorative images", () => {
      render(<Flag currency="JPY" alt="" />);

      const img = screen.getByAltText("");
      expect(img).toHaveAttribute("alt", "");
    });
  });

  describe("Image Props & Styling", () => {
    it("applies fixed 20x20 dimensions and eager loading strategy", () => {
      render(<Flag currency="CAD" alt="Canadian Dollar" />);

      const img = screen.getByAltText("Canadian Dollar");
      expect(img).toHaveAttribute("width", "20");
      expect(img).toHaveAttribute("height", "20");
      expect(img).toHaveAttribute("loading", "eager");
    });

    it("applies mandatory CSS classes for rounded circular display", () => {
      render(<Flag currency="CHF" alt="Swiss Franc" />);

      const img = screen.getByAltText("Swiss Franc");
      expect(img).toHaveClass("aspect-square", "object-cover", "rounded-full");
    });
  });

  describe("Utility Integration", () => {
    vi.spyOn(currencyModule, "getCurrencyCountry");

    it("invokes getCurrencyCountry with the exact currency string prop", () => {
      render(<Flag currency="CDF" alt="Congolese Franc" />);

      expect(currencyModule.getCurrencyCountry).toHaveBeenCalledTimes(1);
      expect(currencyModule.getCurrencyCountry).toHaveBeenCalledWith("CDF");
    });
  });
});

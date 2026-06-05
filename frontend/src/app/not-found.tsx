"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftCircle } from "lucide-react"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 overflow-hidden relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.18] dark:opacity-[0.15]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-foreground"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Animated route visualization */}
      <div className="relative w-full max-w-lg h-64 mb-8">
        <svg
          viewBox="0 0 400 200"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main broken route path */}
          <path
            d="M 40 100 Q 100 100 140 60 Q 180 20 220 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="8 4"
            className="text-muted-foreground/40 dark:text-muted-foreground/30"
          />

          {/* Animated segment that breaks */}
          <path
            d="M 40 100 Q 100 100 140 60 Q 180 20 220 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-foreground animate-[dash_3s_ease-in-out_infinite]"
            strokeDasharray="60"
            strokeDashoffset="0"
            style={{
              animation: "dash 3s ease-in-out infinite",
            }}
          />

          {/* Disconnected/broken segment */}
          <g className="animate-[float_4s_ease-in-out_infinite]">
            <path
              d="M 250 80 Q 280 100 300 70"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 4"
              className="text-muted-foreground/50"
            />
          </g>

          <g
            className="animate-[floatAlt_5s_ease-in-out_infinite]"
            style={{ animationDelay: "0.5s" }}
          >
            <path
              d="M 320 90 Q 350 60 370 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 4"
              className="text-muted-foreground/30"
            />
          </g>

          {/* Start node */}
          <g className="animate-pulse">
            <circle
              cx="40"
              cy="100"
              r="8"
              fill="currentColor"
              className="text-foreground"
            />
            <circle
              cx="40"
              cy="100"
              r="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-foreground/30"
            />
          </g>

          {/* Broken endpoint - pulsing with warning */}
          <g>
            <circle
              cx="220"
              cy="60"
              r="6"
              fill="currentColor"
              className="text-muted-foreground/60 animate-pulse"
            />
            {/* X mark indicating broken route */}
            <g className="text-muted-foreground">
              <line
                x1="212"
                y1="52"
                x2="228"
                y2="68"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="228"
                y1="52"
                x2="212"
                y2="68"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* Floating disconnected nodes */}
          <circle
            cx="300"
            cy="70"
            r="4"
            fill="currentColor"
            className="text-muted-foreground/40 animate-[float_4s_ease-in-out_infinite]"
          />
          <circle
            cx="370"
            cy="100"
            r="4"
            fill="currentColor"
            className="text-muted-foreground/20 animate-[floatAlt_5s_ease-in-out_infinite]"
          />

          {/* Ghost destination */}
          <g className="opacity-20">
            <circle
              cx="360"
              cy="140"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 3"
              className="text-foreground"
            />
            <circle cx="360" cy="140" r="3" fill="currentColor" className="text-foreground" />
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-md">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            route::error
          </span>
        </div>

        <h1 className="text-8xl font-mono font-bold tracking-tighter text-foreground mb-2">
          404
        </h1>

        <p className="text-lg text-muted-foreground mb-2 font-medium">
          Route not found
        </p>

        <p className="text-sm text-muted-foreground/70 mb-8 font-mono">
          The path you requested could not be resolved.
          <br />
          No valid route exists to this destination.
        </p>

        {/* Terminal-style info box */}
        <div className="bg-muted/50 dark:bg-muted/30 border border-border rounded-lg p-4 mb-8 text-left font-mono text-xs">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <span className="text-foreground/70">$</span>
            <span>navix route --resolve</span>
          </div>
          <div className="text-muted-foreground/60 pl-4 space-y-1">
            <p>
              <span className="text-muted-foreground">status:</span>{" "}
              <span className="text-destructive">UNREACHABLE</span>
            </p>
            <p>
              <span className="text-muted-foreground">nodes:</span> 0
            </p>
            <p>
              <span className="text-muted-foreground">constraint:</span>{" "}
              PATH_NOT_FOUND
            </p>
          </div>
        </div>

        {/* Action button */}
        <Button
            asChild
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg font-medium text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
        >
            <Link href="/">
        <ArrowLeftCircle className="animate-pulse"/>
          Return to origin
            </Link>
        </Button>

        <p className="mt-6 text-xs text-muted-foreground/50 font-mono">
          navix v0.1.0
        </p>
      </div>
    </div>
  )
}

export default NotFound

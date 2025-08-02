"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { TicketDetail } from "@/components/tickets/ticket-detail";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRealtimeStore } from "@/lib/realtime-store";

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = Number(params.id);
  const [loading, setLoading] = useState(true);

  const { setTickets } = useRealtimeStore();

  // Load tickets when component mounts
  useEffect(() => {
    const loadTickets = async () => {
      try {
        // Simulating API call - replace this with your actual API call
        const response = await fetch("/api/tickets");
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Failed to load tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [setTickets]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <TicketDetail ticketId={ticketId} />
    </div>
  );
}

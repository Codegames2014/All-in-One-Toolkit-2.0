"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const timeZones = Intl.supportedValuesOf('timeZone');

const popularTimeZones = [
    "America/New_York",   // EST
    "America/Chicago",    // CST
    "America/Denver",     // MST
    "America/Los_Angeles",// PST
    "Europe/London",      // GMT/BST
    "Europe/Paris",       // CET/CEST
    "Asia/Tokyo",         // JST
    "Australia/Sydney",   // AEST/AEDT
    "Asia/Kolkata",       // IST
    "Asia/Dubai",         // GST
    "America/Sao_Paulo",  // BRT
];

const TimeCard = ({ time, timeZone, onRemove }: { time: string, timeZone: string, onRemove: (tz: string) => void }) => {
    const city = timeZone.split('/').pop()?.replace(/_/g, ' ') || timeZone;
    const [date, timeString] = time.split(',');

    return (
        <Card className="text-center relative group">
            <CardHeader>
                <CardTitle>{city}</CardTitle>
                <CardDescription>{date}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold font-mono">{timeString}</p>
                <p className="text-sm text-muted-foreground">{timeZone}</p>
            </CardContent>
             <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" onClick={() => onRemove(timeZone)}>
                <X className="h-4 w-4" />
            </Button>
        </Card>
    )
}

export function TimeZoneCheckerUI() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeZones, setSelectedTimeZones] = useState<string[]>(popularTimeZones);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const addTimeZone = (tz: string) => {
    if (tz && !selectedTimeZones.includes(tz)) {
      setSelectedTimeZones(prev => [...prev, tz]);
    }
  }
  
  const removeTimeZone = (tz: string) => {
    setSelectedTimeZones(prev => prev.filter(t => t !== tz));
  }

  const filteredTimeZones = search ? timeZones.filter(tz => tz.toLowerCase().includes(search.toLowerCase())) : timeZones;

  return (
    <div className="space-y-8">
        <Card>
            <CardContent className="p-6">
                 <div className="flex gap-4">
                     <Select onValueChange={addTimeZone}>
                        <SelectTrigger>
                            <SelectValue placeholder="Add a time zone..." />
                        </SelectTrigger>
                        <SelectContent>
                             <div className="p-2">
                                <Input placeholder="Search timezones..." value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                            {filteredTimeZones.slice(0, 300).map(tz => (
                                <SelectItem key={tz} value={tz}>{tz.replace(/_/g, ' ')}</SelectItem>
                            ))}
                        </SelectContent>
                     </Select>
                 </div>
            </CardContent>
        </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {selectedTimeZones.map(tz => (
          <TimeCard
            key={tz}
            timeZone={tz}
            time={currentTime.toLocaleString("en-US", { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'long', month: 'long', day: 'numeric'})}
            onRemove={removeTimeZone}
          />
        ))}
      </div>
    </div>
  );
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  comingSoon?: boolean;
}

export const tools: Tool[] = [
  {
    id: 'ad-generator',
    name: 'Ad Generator',
    description: 'Whip up scroll-stopping static & animated ads in seconds',
    url: 'https://ad-generator-279545860595.us-central1.run.app/',
    icon: 'megaphone',
  },
  {
    id: 'briteco-brief',
    name: 'BriteCo Brief',
    description: 'Your agent newsletter, brewed fresh monthly',
    url: 'https://briteco-brief-279545860595.us-central1.run.app/',
    icon: 'file-text',
  },
  {
    id: 'brite-mail',
    name: 'BriteMail',
    description: 'Automated sales emails & smart replies that close deals faster',
    url: 'https://brite-mail-279545860595.us-central1.run.app/',
    icon: 'send',
  },
  {
    id: 'ceo-article-generator',
    name: 'CEO Article Generator',
    description: 'Thought leadership articles crafted for Forbes, Entrepreneur & Fast Company',
    url: 'https://ceo-article-generator-279545860595.us-central1.run.app/',
    icon: 'pen-tool',
  },
  {
    id: 'commercial-wizard',
    name: 'Commercial Wizard',
    description: 'Conjure up commercial ads that actually convert',
    url: 'https://ai-commercial-wizard-bs2oux2teq-uc.a.run.app/wizard',
    icon: 'building',
  },
  {
    id: 'consumer-newsletter',
    name: 'Consumer Newsletter',
    description: 'Generate engaging newsletters for consumer audiences',
    url: 'https://consumer-newsletter-279545860595.us-central1.run.app',
    icon: 'mail',
  },
  {
    id: 'optic-outreach',
    name: 'Optic Outreach',
    description: 'Spot, scrub & serve up sales-ready leads on autopilot',
    url: 'https://opticoutreach.web.app/',
    icon: 'target',
  },
  {
    id: 'planner-pulse',
    name: 'Planner Pulse',
    description: 'Newsletter vibes that keep planners in the loop',
    url: 'https://planner-pulse-279545860595.us-central1.run.app/',
    icon: 'calendar-heart',
  },
  {
    id: 'reddit-comment-tracker',
    name: 'Reddit Comment Tracker',
    description: 'Stay on top of what people are saying on your posts',
    url: 'https://britepulse-reddit-279545860595.us-central1.run.app',
    icon: 'message-square',
  },
  {
    id: 'stay-in-the-loupe',
    name: 'Stay in the Loupe',
    description: 'Sparkling newsletter content for jewelers',
    url: 'https://stay-in-the-loupe-279545860595.us-central1.run.app/',
    icon: 'gem',
  },
  {
    id: 'venue-voice',
    name: 'Venue Voice',
    description: 'Content that makes every venue feel like the main event',
    url: 'https://venue-voice-279545860595.us-central1.run.app/',
    icon: 'home',
  },
  {
    id: 'video-ad-generator',
    name: 'Video Ad Generator',
    description: 'Snappy video clips that pack a punch',
    url: 'https://video-ad-generator-279545860595.us-central1.run.app/',
    icon: 'video',
  },
  {
    id: 'briteco-tool-2',
    name: 'New Tool Coming Soon',
    description: 'Exciting new BriteCo tool in development',
    url: '#',
    icon: 'plus',
    comingSoon: true,
  },
  {
    id: 'briteco-tool-3',
    name: 'New Tool Coming Soon',
    description: 'Exciting new BriteCo tool in development',
    url: '#',
    icon: 'plus',
    comingSoon: true,
  },
  {
    id: 'briteco-tool-4',
    name: 'New Tool Coming Soon',
    description: 'Exciting new BriteCo tool in development',
    url: '#',
    icon: 'plus',
    comingSoon: true,
  },
];

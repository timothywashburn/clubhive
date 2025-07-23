import { DiscordIcon } from '../../../components/DiscordIcon';
import { InstagramIcon } from '../../../components/InstagramIcon';
import { GlobeIcon } from '../../../components/GlobeIcon';

type SocialLinksProps = {
    discordUrl?: string;
    instagramUrl?: string;
    websiteUrl?: string;
};

export default function SocialLinks({ discordUrl, instagramUrl, websiteUrl }: SocialLinksProps) {
    return (
        <div className="flex gap-5 justify-end">
            {discordUrl && (
                <a href={discordUrl} target="_blank" rel="noopener noreferrer">
                    <div className="w-10 h-10 bg-discord rounded-full p-1.25">
                        <DiscordIcon className="w-full h-full text-white" />
                    </div>
                </a>
            )}
            {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                    <div className="w-10 h-10 bg-instagram rounded-full p-1.25">
                        <InstagramIcon className="w-full h-full text-white" />
                    </div>
                </a>
            )}
            {websiteUrl && (
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                    <div className="w-10 h-10 bg-globe rounded-full p-1.25">
                        <GlobeIcon className="w-full h-full text-white" />
                    </div>
                </a>
            )}
        </div>
    );
}

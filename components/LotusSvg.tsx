const LotusSvg = () => (
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
        <ellipse cx="12" cy="15" rx="2.5" ry="5" fill="url(#lotus1)" />
        <ellipse
            cx="7" cy="14" rx="2" ry="4"
            transform="rotate(-25 7 14)"
            fill="url(#lotus2)"
            opacity="0.8"
        />
        <ellipse
            cx="17" cy="14" rx="2" ry="4"
            transform="rotate(25 17 14)"
            fill="url(#lotus2)"
            opacity="0.8"
        />
        <defs>
            <linearGradient id="lotus1" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#FFD700" />
                <stop offset="1" stopColor="#FF8C00" />
            </linearGradient>
            <linearGradient id="lotus2" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#FFB700" />
                <stop offset="1" stopColor="#FF6B00" />
            </linearGradient>
        </defs>
    </svg>
);

export default LotusSvg;
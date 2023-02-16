import { FC, useEffect, useMemo, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

interface QrCodeProps {
    size: number
    data: string
}

export const QrCode: FC<QrCodeProps> = ({ size, data, ...props }) => {
    const ref = useRef<HTMLDivElement>(null);
    const qrCode = useMemo(
        () =>
            new QRCodeStyling({
                width: 220,
                height: 220,
                type: 'svg',
                dotsOptions: { type: 'dots', color: '#000000' },
                cornersSquareOptions: { type: 'dot', color: '#000000' },
                cornersDotOptions: { type: 'dot', color: '#000000' },
                imageOptions: {
                    crossOrigin: 'anonymous'
                }
            }),
        []
    );
    useEffect(() => {
        qrCode.append(ref.current ?? undefined);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        qrCode.update({ data });
    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div
            ref={ref}
            className="qrcode"
            style={{
                borderRadius: 48,
                overflow: 'hidden',
                backgroundColor: 'white',
                padding: 24
            }}
            {...props}
        />
    );
};

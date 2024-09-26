import type React from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { animated, to, useSpringValue } from "@react-spring/web";

import { CardId } from "@/types";
import { draggingIdA, type CardProps } from "@/components/Card";

import { standardization } from "@/utils/math";
import CardPlace from "./CardPlace";
import { useAtomValue } from "jotai";

const CardsSet: React.FC<{
    cards: CardProps[];
    className?: string;
    yFarthest?: number;
    yClosest?: number;
}> = ({ cards, yFarthest = 600, yClosest = 450 }) => {
    const relateXRef = useRef(0);
    const relateYRef = useRef(0);

    const ref = useRef<HTMLDivElement>(null);

    const draggingId = useAtomValue(draggingIdA);

    useEffect(() => {
        const ctrler = new AbortController();

        window.addEventListener("mousemove", (evt) => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();

            const relateXStd =
                (rect.left + rect.width / 2 - evt.clientX) / (rect.width * 2.5);

            const relateYStd =
                1 -
                standardization(
                    rect.top + rect.height / 2 - evt.clientY,
                    yFarthest,
                    yClosest
                );

            if (relateYStd < 1 || draggingId) relateXRef.current = 0;
            else relateXRef.current = relateXStd;

            if (Math.abs(relateXStd) >= 0.5 || draggingId)
                relateYRef.current = 0;
            else relateYRef.current = relateYStd;
        });

        return () => ctrler.abort();
    }, [yClosest, yFarthest, draggingId]);

    const getOffset = useCallback(
        (idx: number) =>
            (idx - (cards.length - 1) / 2) / ((cards.length - 1) / 2),
        [cards]
    );

    return (
        <animated.div
            ref={ref}
            className={"absolute h-[150mm] w-1/3 -bottom-1/2"}
        >
            <div className="size-full relative">
                {cards.map((card, i, arr) => (
                    <CardPlace
                        idxOffset={i / (arr.length - 1) - 0.5}
                        key={CardId.unwrap(card.id)}
                        relate={getOffset(i)}
                        card={card}
                        relateXRef={relateXRef}
                        relateYRef={relateYRef}
                    />
                ))}
            </div>
        </animated.div>
    );
};
export default CardsSet;

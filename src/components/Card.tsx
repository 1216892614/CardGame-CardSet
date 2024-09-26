import React, { useEffect, useRef } from "react";
import { atom, useAtom } from "jotai";
import { useDraggable } from "@dnd-kit/core";
import { animated, type SpringConfig, useSpring } from "@react-spring/web";

import { CardId } from "@/types";
import useRefShare from "@/hooks/useRefShare";

const SPRING_CONFIG: SpringConfig = {
    tension: 300,
    friction: 30,
    mass: 1,
    precision: 0.01,
    clamp: true,
};

export const draggingIdA = atom<CardId | null>(null);

export type CardProps = {
    id: CardId;
    title: string;
    onDraggingChange?: (isDragging: boolean) => void;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ title, id, onDraggingChange }, ref) => {
        const cardRef = useRef<HTMLDivElement>(null);

        const [draggingId, setDraggingId] = useAtom(draggingIdA);

        const { attributes, listeners, setNodeRef, transform, isDragging } =
            useDraggable({ id: CardId.unwrap(id) });

        const [cardStyle, cardApis] = useSpring(() => ({
            transform: `translate3d(${transform?.x ?? 0}px, ${
                transform?.y ?? 0
            }px, 0)`,
            config: SPRING_CONFIG,
        }));

        useEffect(() => {
            onDraggingChange?.(isDragging);

            if (isDragging) setDraggingId(id);

            if (!isDragging && draggingId === id) setDraggingId(null);
        }, [isDragging, onDraggingChange, setDraggingId, draggingId, id]);

        useEffect(() => {
            if (transform)
                cardApis.set({
                    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
                });
            else
                cardApis.start({
                    transform: `translate3d(${0}px, ${0}px, 0)`,
                });
        }, [cardApis.set, cardApis.start, transform]);

        useRefShare(cardRef, ref, setNodeRef);

        return (
            <animated.div
                id={CardId.unwrap(id)}
                className="h-[88mm] w-[57mm] bg-primary border-orange-600 hover:border-orange-300 border-solid border-2"
                ref={cardRef}
                style={cardStyle}
                {...listeners}
                {...attributes}
            >
                <h1 className="font-bold ml-2 mt-2 text-3xl">{title}</h1>
            </animated.div>
        );
    }
);

export default Card;

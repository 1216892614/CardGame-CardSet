import {
    type MutableRefObject,
    useEffect,
    type ComponentProps,
    type FC,
} from "react";
import {
    animated,
    type SpringConfig,
    to,
    useSpringValue,
} from "@react-spring/web";

import { rangeMap } from "@/utils/math";
import { CardId } from "@/types";
import Card, { draggingIdA, type CardProps } from "@/components/Card";
import _ from "lodash";
import { useAtomValue } from "jotai";
import useFrame from "@/hooks/useFrame";

const AniConfig: SpringConfig = {
    mass: 1,
    tension: 300,
    friction: 30,
};

const DEG = 1;

const CardPlace: FC<
    {
        relate: number;
        card: CardProps;
        idxOffset: number;
        relateXRef: MutableRefObject<number>;
        relateYRef: MutableRefObject<number>;
    } & ComponentProps<typeof animated.div>
> = ({
    relate,
    card,
    relateXRef,
    relateYRef,
    idxOffset,
    className,
    style,
    ...rest
}) => {
    const draggingId = useAtomValue(draggingIdA);

    const springTopRelate = useSpringValue(0);
    const springTopPx = useSpringValue(0);
    const springLeftRelate = useSpringValue(50, {
        config: AniConfig,
    });
    const springLeftPx = useSpringValue(0, {
        config: AniConfig,
    });
    const springRotate = useSpringValue(0, {
        config: AniConfig,
    });
    const springScale = useSpringValue(0.5);

    useFrame(() => {
        if (draggingId === card.id) return;

        const [relateX, relateY] = [relateXRef.current, relateYRef.current];

        // 提取重复计算的部分
        const cosRelateX = Math.cos((relate + relateX) * DEG);
        const sinRelateX = Math.sin((relate + relateX) * DEG);
        const relateYMapped = rangeMap(relateY, 0, -0.2);
        const relateYCondition = relateY < 1;
        const tanhOffsetX = Math.tanh((idxOffset + relateX) * 20);
        const tanhOffsetXSmall = Math.tanh((idxOffset + relateX + 0.01) * 10);
        const absTanhOffsetXSmall = Math.abs(tanhOffsetXSmall);

        // 优化计算量
        springTopRelate.start(-cosRelateX - relateYMapped * relateY * 100);

        springLeftRelate.start((sinRelateX * relateY + (1 - relateX)) * 50);

        springTopPx.start(
            relateYCondition ? 0 : (absTanhOffsetXSmall - 1) * relateY * 200
        );

        springLeftPx.start(
            relateYCondition
                ? 0
                : (tanhOffsetX - relateX * 1.5) *
                      relateY *
                      (document.body.clientWidth / 6)
        );

        springRotate.start((((relate + relateX * 2) * DEG) / 2) * relateY);

        springScale.start(rangeMap(relateY, 1, 0.5));
    });

    useEffect(() => {
        if (draggingId === card.id) {
            springTopRelate.start(0);
            springTopPx.pause();
            springLeftRelate.pause();
            springLeftPx.pause();
            springRotate.start(0);
            springScale.start(1);
        } else {
            springLeftRelate.resume();
            springTopPx.resume();
            springLeftPx.resume();
        }
    }, [
        springTopRelate,
        springLeftRelate,
        springTopPx,
        springLeftPx,
        springRotate,
        springScale,
        draggingId,
        card.id,
    ]);

    return (
        <animated.div
            {...rest}
            className={`${className} absolute`}
            key={CardId.unwrap(card.id)}
            style={{
                left: to(
                    [springLeftRelate, springLeftPx],
                    (leftRelate, leftPx) => `calc(${leftRelate}% + ${leftPx}px)`
                ),
                top: to(
                    [springTopRelate, springTopPx],
                    (r, p) => `calc(${r}% + ${p}px)`
                ),
                transform: to(
                    [springScale, springRotate],
                    (s, r) =>
                        `translate(-50%, -50%) scale(${s}) rotate(${r}rad)`
                ),
                ...style,
            }}
        >
            <Card {...card} />
        </animated.div>
    );
};

export default CardPlace;

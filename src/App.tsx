import { DndContext } from "@dnd-kit/core";

import ThemeCtrl from "./components/ThemeCtrl";
import CardsSet from "./components/CardsSet";
import Card from "./components/Card";
import { CardId } from "./types";
import cards from "./mocks/cards";

const App = () => {
    return (
        <DndContext>
            <main className="relative overflow-hidden w-screen h-screen flex flex-col justify-center items-center">
                <nav className="absolute h-screen w-14 left-0 py-2 bg-secondary flex flex-col justify-start items-center">
                    <ThemeCtrl />
                </nav>

                <div />

                <Card title="test" id={CardId("test")} />

                <CardsSet cards={cards} />
            </main>
        </DndContext>
    );
};

export default App;

import React from "react";
import {at} from "../timing";
import {AUDIO_DURATION} from "../timing";
import {Hook, OneIdea, Roadmap, SilentAgent, TheBug, TwoQuestions, SceneProps} from "./ch1";
import {HiddenState, LogitsChances, Loop, LossGradient, RopeTokenRecap, Singers, WeakSpots} from "./ch2";
import {Adam, Caveats, CaveatThree, Cliff, CodeTest, Combine, Distill, Fix, Grokking, MaxShift, OneLine, PaperExample, Precision, Results} from "./ch3";
import {AgentResults, Coconut, Gaia, HowItWorks, HybridLink, Memory, PickPrice, ReadThoughts, Related, RL, Safety, ServingWarning, Snowball, Squeeze, TheTable, WhichSteps} from "./ch4";
import {Catch, Close, Dial, DistillGuess, FairFight, Floors, GateSummary, Monday, PaperThree, Scaling} from "./ch5";

export type SceneDef = {
  id: string;
  title: string;
  start: number;
  Component: React.FC<SceneProps>;
};

const defs: {id: string; title: string; phrase: string; offset?: number; Component: React.FC<SceneProps>}[] = [
  {id: "01", title: "one function", phrase: "Every AI model", Component: Hook},
  {id: "02", title: "the bug", phrase: "Last month, Google DeepMind", Component: TheBug},
  {id: "03", title: "the silent agent", phrase: "That's only half", Component: SilentAgent},
  {id: "04", title: "three papers", phrase: "This video breaks down three new papers", Component: Roadmap},
  {id: "05", title: "two questions", phrase: "These two stories are connected", offset: 0.4, Component: TwoQuestions},
  {id: "06", title: "one idea", phrase: "Three papers answer both", Component: OneIdea},
  {id: "07", title: "the loop", phrase: "A language model does one job", Component: Loop},
  {id: "08", title: "hidden state", phrase: "Step one. The model thinks", Component: HiddenState},
  {id: "09", title: "logits and chances", phrase: "Step two. The model scores every word", offset: 0.4, Component: LogitsChances},
  {id: "10", title: "softmax singers", phrase: "That machine is softmax", Component: Singers},
  {id: "11", title: "loss and gradient", phrase: "Now, how does the model learn", Component: LossGradient},
  {id: "12", title: "the rope", phrase: "Add those up across all words", Component: RopeTokenRecap},
  {id: "13", title: "weak spots", phrase: "Today is about two weak spots", Component: WeakSpots},
  {id: "14", title: "grokking", phrase: "Let me tell you a story first", Component: Grokking},
  {id: "15", title: "one line", phrase: "Nobody had a clean explanation", Component: OneLine},
  {id: "16", title: "max shift", phrase: "Idea one. Softmax has an overflow problem", Component: MaxShift},
  {id: "17", title: "precision", phrase: "Idea two. Computers can't keep every digit", Component: Precision},
  {id: "18", title: "combine", phrase: "Now put the two ideas together", Component: Combine},
  {id: "19", title: "paper example", phrase: "Here's the paper's example", Component: PaperExample},
  {id: "20", title: "precision cliff", phrase: "Let's call the line where this starts", Component: Cliff},
  {id: "21", title: "adam", phrase: "Adam is the default optimizer", Component: Adam},
  {id: "22", title: "results", phrase: "Now the test. Modular addition", Component: Results},
  {id: "23", title: "distillation", phrase: "There's a second bug", Component: Distill},
  {id: "24", title: "the fix", phrase: "So what's the fix", Component: Fix},
  {id: "25", title: "code test", phrase: "Now check your own code", Component: CodeTest},
  {id: "26", title: "caveats", phrase: "Three caveats before you rewrite anything", Component: Caveats},
  {id: "27", title: "caveat three", phrase: "Three. A follow-up paper", Component: CaveatThree},
  {id: "28", title: "the price", phrase: "Now the second weak spot", Component: PickPrice},
  {id: "29", title: "the squeeze", phrase: "And look at what happens at each word", Component: Squeeze},
  {id: "30", title: "coconut", phrase: "A 2024 paper called Coconut", Component: Coconut},
  {id: "31", title: "gaia", phrase: "And the numbers are brutal", Component: Gaia},
  {id: "32", title: "how it works", phrase: "Here's how it works", Component: HowItWorks},
  {id: "33", title: "hybridlink", phrase: "The piece that makes this work", Component: HybridLink},
  {id: "33b", title: "memory", phrase: "Then there's memory", offset: 2.0, Component: Memory},
  {id: "34", title: "serving warning", phrase: "One warning for builders", Component: ServingWarning},
  {id: "35", title: "snowball", phrase: "Training this is the hard part", Component: Snowball},
  {id: "36", title: "rl", phrase: "Problem two is my favorite", Component: RL},
  {id: "37", title: "which steps", phrase: "Which steps go silent", Component: WhichSteps},
  {id: "38", title: "results", phrase: "Now the results", offset: 0.3, Component: AgentResults},
  {id: "39", title: "the table", phrase: "Now, the test I promised", Component: TheTable},
  {id: "40", title: "read thoughts", phrase: "Can you read them too", Component: ReadThoughts},
  {id: "41", title: "safety", phrase: "There's a safety angle too", Component: Safety},
  {id: "42", title: "related work", phrase: "It's not just this paper", Component: Related},
  {id: "44", title: "floors", phrase: "Now the third paper", Component: Floors},
  {id: "45", title: "fair fight", phrase: "Is that worth it", Component: FairFight},
  {id: "46", title: "scaling", phrase: "Mostly yes", Component: Scaling},
  {id: "47", title: "the catch", phrase: "There is a catch", Component: Catch},
  {id: "48", title: "the dial", phrase: "Put the three papers together", Component: Dial},
  {id: "49", title: "gate summary", phrase: "Softmax is the gate every thought", Component: GateSummary},
  {id: "50", title: "distill guess", phrase: "This next part is a guess", offset: 0.5, Component: DistillGuess},
  {id: "51", title: "monday", phrase: "So what do you do on Monday", offset: 1.0, Component: Monday},
  {id: "52", title: "close", phrase: "So much of this work", Component: Close},
];

export const SCENES: SceneDef[] = defs.map((d) => ({
  id: d.id,
  title: d.title,
  start: +(at(d.phrase) + (d.offset ?? 0)).toFixed(3),
  Component: d.Component,
}));

export const TOTAL_DURATION = 1194.88;
export {AUDIO_DURATION};

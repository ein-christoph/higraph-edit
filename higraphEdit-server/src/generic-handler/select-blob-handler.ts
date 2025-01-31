import { Command, JsonOperationHandler, MaybePromise, Operation, SelectAction } from "@eclipse-glsp/server";
import { injectable } from "inversify";

@injectable()
export class SelectBlobHandler extends JsonOperationHandler{
    override operationType = SelectAction.KIND;

    override createCommand(operation: Operation): MaybePromise<Command | undefined> {
        throw new Error("Method selectBlobHandler not implemented.");
    }

}
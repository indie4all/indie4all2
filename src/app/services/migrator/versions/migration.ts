export default abstract class Migration {
    public abstract run(model: any): Promise<void>;
}
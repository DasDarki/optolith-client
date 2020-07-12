type t = {
  id: int,
  name: string,
  description: string,
  src: list(SourceRef.t),
  errata: list(Erratum.t),
};

module Decode = {
  open Json.Decode;

  let t = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    description: json |> field("description", string),
    src: json |> field("src", SourceRef.Decode.list),
    errata: json |> field("errata", Erratum.Decode.list),
  };

  let all = (yamlData: Yaml_Raw.yamlData) =>
    yamlData.optionalRulesL10n
    |> list(t)
    |> Ley_List.map(x => (x.id, x))
    |> Ley_IntMap.fromList;
};